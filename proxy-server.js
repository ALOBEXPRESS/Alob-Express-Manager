import http from 'http';
import httpProxy from 'http-proxy';
import net from 'net';

const proxy = httpProxy.createProxyServer({ ws: true });

const NEXT_PORT_MIN = Number(process.env.NEXT_PORT_MIN ?? 3001);
const NEXT_PORT_MAX = Number(process.env.NEXT_PORT_MAX ?? NEXT_PORT_MIN + 20);
const VITE_PORT_MIN = Number(process.env.VITE_PORT_MIN ?? process.env.VITE_PORT ?? 5173);
const VITE_PORT_MAX = Number(process.env.VITE_PORT_MAX ?? VITE_PORT_MIN + 20);
const PROXY_PORT_MIN = Number(process.env.PROXY_PORT_MIN ?? 8083);
const PROXY_PORT_MAX = Number(process.env.PROXY_PORT_MAX ?? PROXY_PORT_MIN + 20);

let cachedNextPort = null;
let cachedNextPortAt = 0;
let cachedVitePort = null;
let cachedVitePortAt = 0;

const NEXT_PORT_CACHE_TTL_MS = 15000;
const VITE_PORT_CACHE_TTL_MS = 15000;
const PROXY_UPSTREAM_TIMEOUT_MS = 120000;

function filterCookies(cookieHeader, allowListRegexes) {
  if (!cookieHeader) return undefined;
  const cookies = cookieHeader.split(';').map((c) => c.trim()).filter(Boolean);
  const kept = new Map();

  for (const cookie of cookies) {
    const name = cookie.split('=')[0]?.trim();
    if (!name) continue;
    if (allowListRegexes.some((rx) => rx.test(name))) {
      if (kept.has(name)) kept.delete(name);
      kept.set(name, cookie);
    }
  }

  return kept.size > 0 ? Array.from(kept.values()).join('; ') : undefined;
}

const SUPABASE_COOKIE_ALLOWLIST = [
  /^sb-[a-z0-9]{20}-auth-token$/i,
  /^sb-[a-z0-9]{20}-auth-token-code-verifier$/i,
];

async function probeNextServer(port) {
  return new Promise((resolve) => {
    const req = http.request(
      {
        hostname: 'localhost',
        port,
        path: '/pt-br/sign-in',
        method: 'GET',
        timeout: 2500,
      },
      (res) => {
        const poweredBy = String(res.headers['x-powered-by'] ?? '');
        if (poweredBy.toLowerCase().includes('next')) {
          res.resume();
          resolve(true);
          return;
        }

        let body = '';
        res.on('data', (chunk) => {
          if (body.length < 2048) body += chunk.toString('utf8');
        });
        res.on('end', () => resolve(body.includes('__NEXT_DATA__')));
      },
    );

    req.on('timeout', () => {
      req.destroy();
      resolve(false);
    });
    req.on('error', () => resolve(false));
    req.end();
  });
}

async function isPortListening(port) {
  return new Promise((resolve) => {
    const socket = net.connect({ host: '127.0.0.1', port });
    const done = (value) => {
      try {
        socket.destroy();
      } catch {}
      resolve(value);
    };

    socket.setTimeout(250);
    socket.on('connect', () => done(true));
    socket.on('timeout', () => done(false));
    socket.on('error', () => done(false));
  });
}

async function findNextPort(port, candidatePort = null) {
  if (port > NEXT_PORT_MAX) return candidatePort;

  const listening = await isPortListening(port);
  if (!listening) return findNextPort(port + 1, candidatePort);

  const ok = await probeNextServer(port);
  if (ok) return port;

  return findNextPort(port + 1, candidatePort ?? port);
}

async function resolveNextPort() {
  const now = Date.now();
  if (cachedNextPort && now - cachedNextPortAt < NEXT_PORT_CACHE_TTL_MS) return cachedNextPort;

  const found = await findNextPort(NEXT_PORT_MIN);
  cachedNextPort = found ?? NEXT_PORT_MIN;
  cachedNextPortAt = now;
  return cachedNextPort;
}

async function probeViteServer(port) {
  return new Promise((resolve) => {
    const req = http.request(
      {
        hostname: 'localhost',
        port,
        path: '/',
        method: 'GET',
        timeout: 400,
      },
      (res) => {
        let body = '';
        res.on('data', (chunk) => {
          if (body.length < 4096) body += chunk.toString('utf8');
        });
        res.on('end', () => resolve(body.includes('/@vite/client') || body.includes('vite')));
      },
    );

    req.on('timeout', () => {
      req.destroy();
      resolve(false);
    });
    req.on('error', () => resolve(false));
    req.end();
  });
}

async function findVitePort(port) {
  const ok = await probeViteServer(port);
  if (ok) return port;
  if (port >= VITE_PORT_MAX) return null;
  return findVitePort(port + 1);
}

async function resolveVitePort() {
  const now = Date.now();
  if (cachedVitePort && now - cachedVitePortAt < VITE_PORT_CACHE_TTL_MS) return cachedVitePort;

  const found = await findVitePort(VITE_PORT_MIN);
  cachedVitePort = found ?? VITE_PORT_MIN;
  cachedVitePortAt = now;
  return cachedVitePort;
}

async function isPortAvailable(port) {
  return new Promise((resolve) => {
    const server = net
      .createServer()
      .once('error', () => resolve(false))
      .once('listening', () => {
        server.close(() => resolve(true));
      })
      .listen(port);
  });
}

async function findAvailablePort(startPort, maxPort) {
  const available = await isPortAvailable(startPort);
  if (available) return startPort;
  if (startPort >= maxPort) {
    throw new Error(`Nenhuma porta disponível entre ${startPort} e ${maxPort}`);
  }
  return findAvailablePort(startPort + 1, maxPort);
}

function applyCookiePolicy(req, virtualHost) {
  const host = virtualHost ?? (req.headers.host ?? '');
  const cookieHeader = req.headers.cookie;

  if (host.startsWith('calc.local')) {
    delete req.headers.cookie;
    return;
  }

  if (host.startsWith('app.local')) {
    const filtered = filterCookies(cookieHeader, SUPABASE_COOKIE_ALLOWLIST);
    if (filtered) req.headers.cookie = filtered;
    else delete req.headers.cookie;
    return;
  }

  delete req.headers.cookie;
}

function getRouteInfo(req) {
  const host = String(req.headers.host ?? '');
  const url = String(req.url ?? '/');

  if (url.startsWith('/__app')) {
    req.url = url.slice('/__app'.length) || '/';
    return { route: 'app', virtualHost: 'app.local' };
  }

  if (url.startsWith('/__calc')) {
    req.url = url.slice('/__calc'.length) || '/';
    return { route: 'calc', virtualHost: 'calc.local' };
  }

  // Handle Vite assets served with __calc prefix but not matched above if slicing was wrong or for assets
  // Actually the above handles /__calc/src/main.tsx -> /src/main.tsx which is correct for Vite
  
  if (host.startsWith('app.local')) return { route: 'app', virtualHost: 'app.local' };
  if (host.startsWith('calc.local')) return { route: 'calc', virtualHost: 'calc.local' };
  if (host.startsWith('localhost') || host.startsWith('127.0.0.1') || host.startsWith('[::1]')) {
    return { route: 'app', virtualHost: 'app.local' };
  }

  return { route: null, virtualHost: host };
}

const server = http.createServer((req, res) => {
  const { route, virtualHost } = getRouteInfo(req);

  applyCookiePolicy(req, virtualHost);

  if (route === 'app') {
    resolveNextPort()
      .then((port) =>
        proxy.web(req, res, {
          target: `http://localhost:${port}`,
          changeOrigin: true,
          timeout: PROXY_UPSTREAM_TIMEOUT_MS,
          proxyTimeout: PROXY_UPSTREAM_TIMEOUT_MS,
        }),
      )
      .catch(() => {
        if (!res.headersSent) res.writeHead(502);
        res.end('App indisponível');
      });
  } else if (route === 'calc') {
    resolveVitePort()
      .then((port) =>
        proxy.web(req, res, {
          target: `http://localhost:${port}`,
          changeOrigin: true,
          timeout: PROXY_UPSTREAM_TIMEOUT_MS,
          proxyTimeout: PROXY_UPSTREAM_TIMEOUT_MS,
        }),
      )
      .catch(() => {
        if (!res.headersSent) res.writeHead(502);
        res.end('Calculadora indisponível');
      });
  } else {
    const cookieHeader = String(req.headers.cookie ?? '');
    const cookieNames = cookieHeader
      .split(';')
      .map((c) => c.trim())
      .filter(Boolean)
      .map((c) => c.split('=')[0]?.trim())
      .filter(Boolean);

    const setCookies = cookieNames.map((name) => `${name}=; Max-Age=0; Path=/; SameSite=Lax`);
    const host = String(req.headers.host ?? '');
    const port = host.includes(':') ? host.split(':').pop() : '';
    const appUrl = `http://app.local${port ? `:${port}` : ''}`;
    const calcUrl = `http://calc.local${port ? `:${port}` : ''}`;

    res.writeHead(200, {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'no-store',
      ...(setCookies.length > 0 ? { 'Set-Cookie': setCookies } : {}),
    });
    res.end(
      `<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Alob Express Manager</title></head><body style="font-family:system-ui,-apple-system,Segoe UI,Roboto,Arial,sans-serif;padding:24px"><h1>Alob Express Manager</h1><p>Use os links abaixo (evita problemas de cookie no localhost):</p><ul><li><a href="${appUrl}">${appUrl}</a></li><li><a href="${calcUrl}">${calcUrl}</a></li></ul></body></html>`,
    );
  }
});

server.on('upgrade', (req, socket, head) => {
  const { route, virtualHost } = getRouteInfo(req);
  applyCookiePolicy(req, virtualHost);

  if (route === 'app') {
    resolveNextPort()
      .then((port) =>
        proxy.ws(req, socket, head, {
          target: `http://localhost:${port}`,
          changeOrigin: true,
          timeout: PROXY_UPSTREAM_TIMEOUT_MS,
          proxyTimeout: PROXY_UPSTREAM_TIMEOUT_MS,
        }),
      )
      .catch(() => socket.destroy());
    return;
  }

  if (route === 'calc') {
    resolveVitePort()
      .then((port) =>
        proxy.ws(req, socket, head, {
          target: `http://localhost:${port}`,
          changeOrigin: true,
          timeout: PROXY_UPSTREAM_TIMEOUT_MS,
          proxyTimeout: PROXY_UPSTREAM_TIMEOUT_MS,
        }),
      )
      .catch(() => socket.destroy());
    return;
  }

  socket.destroy();
});

proxy.on('error', (err, req, res) => {
  console.error('Proxy error:', err);

  if (res && typeof res.writeHead === 'function') {
    if (!res.headersSent) res.writeHead(500);
    res.end('Proxy error');
    return;
  }

  if (res && typeof res.end === 'function') {
    try {
      res.end();
    } catch {}
  }
});

async function start() {
  const port = await findAvailablePort(PROXY_PORT_MIN, PROXY_PORT_MAX);
  if (port !== PROXY_PORT_MIN) {
    console.log(`ℹ️ Porta ${PROXY_PORT_MIN} ocupada. Subindo proxy na porta ${port}...`);
  }

  server.listen(port, () => {
    console.log('✅ Proxy rodando:');
    console.log(`  🖥️  App Next.js: http://app.local:${port}`);
    console.log(`  🧮 Calculadora: http://calc.local:${port}`);
  });
}

start().catch((err) => {
  console.error(err);
  process.exit(1);
});

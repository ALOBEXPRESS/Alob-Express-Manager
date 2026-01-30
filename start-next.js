const { spawn } = require('child_process');

async function isPortAvailable(port) {
  return new Promise((resolve) => {
    const tester = spawn(process.execPath, ['-e', `require("net").createServer().listen(${port}).on("listening",()=>process.exit(0)).on("error",()=>process.exit(1))`], {
      stdio: 'ignore',
    });

    tester.on('exit', (code) => resolve(code === 0));
    tester.on('error', () => resolve(false));
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

function startNextOnPort(port) {
  const useTurbo = process.env.NEXT_USE_TURBO === '1';
  const args = [
    '--max-http-header-size=1000000',
    'node_modules/next/dist/bin/next',
    'dev',
    '-p',
    String(port),
  ];
  if (useTurbo) args.splice(3, 0, '--turbo');

  const child = spawn(process.execPath, args, {
    env: { ...process.env, NEXT_PORT: String(port) },
    stdio: ['inherit', 'pipe', 'pipe'],
  });

  let output = '';
  let resolved = false;

  const onData = (chunk, stream) => {
    const text = chunk.toString('utf8');
    output += text;
    if (output.length > 40000) output = output.slice(-40000);
    stream.write(text);
  };

  child.stdout.on('data', (d) => onData(d, process.stdout));
  child.stderr.on('data', (d) => onData(d, process.stderr));

  const readySignals = ['Ready in', 'Local:', 'started server'];

  return new Promise((resolve) => {
    const timeout = setTimeout(() => {
      if (resolved) return;
      resolved = true;
      resolve({ status: 'started', child });
    }, 20000);

    const checkReady = () => {
      if (resolved) return;
      const hasSignal = readySignals.some((s) => output.includes(s));
      const hasPortUrl = output.includes(`http://localhost:${port}`);
      if (hasSignal && (hasPortUrl || output.includes('http://'))) {
        resolved = true;
        clearTimeout(timeout);
        resolve({ status: 'started', child });
      }
    };

    child.stdout.on('data', checkReady);
    child.stderr.on('data', checkReady);

    child.on('exit', (code) => {
      if (resolved) return;
      resolved = true;
      clearTimeout(timeout);
      resolve({ status: 'exited', code: code ?? 0, output });
    });
  });
}

async function main() {
  const startPort = Number(process.env.NEXT_PORT_MIN ?? 3001);
  const maxPort = Number(process.env.NEXT_PORT_MAX ?? startPort + 20);
  let port = await findAvailablePort(startPort, maxPort);

  const tryStart = async (candidatePort) => {
    if (candidatePort !== 3001) {
      console.log(`ℹ️ Porta 3001 ocupada. Tentando Next.js na porta ${candidatePort}...`);
    }

    const result = await startNextOnPort(candidatePort);
    if (result.status === 'started') {
      const shutdown = () => {
        result.child.kill('SIGTERM');
      };

      process.on('SIGINT', shutdown);
      process.on('SIGTERM', shutdown);

      result.child.on('exit', (code) => {
        process.exit(code ?? 0);
      });

      return;
    }

    const isEaddrInUse =
      result.output.includes('EADDRINUSE') || result.output.includes('address already in use');

    if (!isEaddrInUse) {
      process.exit(result.code);
      return;
    }

    const nextPort = candidatePort + 1;
    if (nextPort > maxPort) {
      throw new Error(`Nenhuma porta disponível entre ${startPort} e ${maxPort}`);
    }

    await tryStart(nextPort);
  };

  await tryStart(port);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

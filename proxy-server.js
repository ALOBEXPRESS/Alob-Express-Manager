import http from 'http';
import httpProxy from 'http-proxy';

const proxy = httpProxy.createProxyServer();

const server = http.createServer((req, res) => {
  const host = req.headers.host;

  // Limpar TODOS os cookies antes de fazer proxy
  delete req.headers.cookie;
   
  if (host && host.startsWith('app.local')) {
    proxy.web(req, res, { target: 'http://localhost:3001' });
  } else if (host && host.startsWith('calc.local')) {
    proxy.web(req, res, { target: 'http://localhost:5173' });
  } else {
    // Default fallback ou 404
    // Para facilitar, se não for nenhum dos dois, podemos mandar para o app ou retornar 404
    // Seguindo instrução:
    res.writeHead(404);
    res.end('Not found');
  }
});

proxy.on('error', (err, req, res) => {
  console.error('Proxy error:', err);
  if (!res.headersSent) {
    res.writeHead(500);
    res.end('Proxy error');
  }
});

const PORT = 8080; // Mudar de 80 para 8080
server.listen(PORT, () => {
  console.log('✅ Proxy rodando:');
  console.log(`  🖥️  App Next.js: http://app.local:${PORT}`);
  console.log(`  🧮 Calculadora: http://calc.local:${PORT}`);
});

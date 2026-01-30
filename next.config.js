const createNextIntlPlugin = require('next-intl/plugin');
 
const withNextIntl = createNextIntlPlugin();
 
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  experimental: {
    // Desabilitar otimizações que podem causar problemas
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },
  // Increase max HTTP header size
  serverRuntimeConfig: {
    maxHttpHeaderSize: 32768,
  },
  // Headers globais para prevenir cookies
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-store, no-cache, must-revalidate, private',
          },
          {
            key: 'Pragma',
            value: 'no-cache',
          },
          {
            key: 'Expires',
            value: '0',
          },
        ],
      },
    ];
  },
  async redirects() {
    return [
      {
        source: '/:locale/index-2',
        destination: '/:locale/crm',
        permanent: true,
      },
      {
        source: '/:locale/index-3',
        destination: '/:locale/e-commerce',
        permanent: true,
      },
      {
        source: '/:locale/index-4',
        destination: '/:locale/criptomoeda',
        permanent: true,
      },
      {
        source: '/:locale/index-5',
        destination: '/:locale/investimento',
        permanent: true,
      },
      {
        source: '/:locale/index-6',
        destination: '/:locale/lms',
        permanent: true,
      },
      {
        source: '/:locale/index-7',
        destination: '/:locale/nft-e-jogos',
        permanent: true,
      },
      {
        source: '/:locale/index-8',
        destination: '/:locale/medico',
        permanent: true,
      },
      {
        source: '/:locale/index-9',
        destination: '/:locale/analytics',
        permanent: true,
      },
      {
        source: '/:locale/index-10',
        destination: '/:locale/pdv-e-estoque',
        permanent: true,
      },
      {
        source: '/:locale/index-11',
        destination: '/:locale/financas-e-bancario',
        permanent: true,
      },
    ];
  },
};
 
module.exports = withNextIntl(nextConfig);


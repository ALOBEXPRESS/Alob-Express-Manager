const createNextIntlPlugin = require('next-intl/plugin');
 
const withNextIntl = createNextIntlPlugin();
 
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  experimental: {
    // Increase header size limit to prevent 431 errors
    serverActions: {
      bodySizeLimit: '10mb',
    },
  },
  // Increase max HTTP header size
  serverRuntimeConfig: {
    maxHttpHeaderSize: 240000,
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


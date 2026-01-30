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
    // Solution addition
    optimisticClientCache: false,
  },
  // Increase max HTTP header size
  serverRuntimeConfig: {
    maxHttpHeaderSize: 240000,
  },
  // Headers globais
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          // Existing headers
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
          // Solution headers (Security)
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY'
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block'
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin'
          },
        ],
      },
      {
        // Headers específicos para a página de reset
        source: '/reset-auth.html',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-store, no-cache, must-revalidate, proxy-revalidate'
          },
        ],
      },
    ];
  },
  // Rewrites para garantir que reset-auth funcione
  async rewrites() {
    return [
      {
        source: '/reset-auth',
        destination: '/reset-auth.html',
      },
    ]
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
  // Configurações de compilação
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production' ? {
      exclude: ['error', 'warn'],
    } : false,
  },
  // Configurações de imagem
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.supabase.co',
      },
    ],
  },
};
 
module.exports = withNextIntl(nextConfig);

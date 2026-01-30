/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configurações para prevenir acúmulo de cookies
  experimental: {
    // Desabilita otimizações que podem causar duplicação de cookies
    optimisticClientCache: false,
  },

  // Headers de segurança
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
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
    ]
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

  // Otimizações de produção
  productionBrowserSourceMaps: false,
  reactStrictMode: true,
  poweredByHeader: false,

  // Configurações de compilação
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production' ? {
      exclude: ['error', 'warn'],
    } : false,
  },

  // Configurações de imagem (se usar next/image)
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.supabase.co',
      },
    ],
  },
}

module.exports = nextConfig

/** @type {import('next').NextConfig} */
const nextConfig = {
  /* ✅ Core Next.js 15 Settings */
  reactStrictMode: true,

  /* ✅ Turbopack Configuration (stable in Next.js 15) */
  // turbo: {
  //   rules: {
  //     '*.svg': {
  //       loaders: ['@svgr/webpack'],
  //       as: '*.js',
  //     },
  //   },
  // },

  /* ✅ TypeScript & ESLint */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },

  /* ✅ Image Optimization */
  images: {
    formats: ['image/webp', 'image/avif'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.amazonaws.com',
      },
      {
        protocol: 'https',
        hostname: '**.cloudinary.com',
      },
    ],
  },

  /* ✅ Multi-tenant Rewrites */
  // async rewrites() {
  //   return [
  //     {
  //       source: '/embed/:tenantId*',
  //       destination: '/widget/embed/:tenantId*',
  //     },
  //     {
  //       source: '/api/tenant/:tenantId/:path*',
  //       destination: '/api/:path*',
  //     },
  //   ];
  // },

  /* ✅ Essential Redirects */
  async redirects() {
    return [
      {
        source: '/',
        destination: '/login',
        permanent: false,
      },
    ];
  },

  /* ✅ Environment Variables */
  env: {
    NEXT_PUBLIC_APP_NAME: process.env.NEXT_PUBLIC_APP_NAME,
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
  },
};

export default nextConfig;

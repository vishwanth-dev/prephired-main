// Import path for webpack alias
import path from "path";

/** @type {import('next').NextConfig} */
const nextConfig = {
  /* Core Next.js 15 Settings */
  reactStrictMode: true,

  /* Server External Packages (moved from experimental) */
  serverExternalPackages: ["mongoose"],

  /* Turbopack Configuration (stable in Next.js 15) */
  turbopack: {
    rules: {
      "*.svg": {
        loaders: ["@svgr/webpack"],
        as: "*.js",
      },
    },
  },

  /* Experimental Features for Next.js 15 */
  experimental: {
    // Optimize for multi-tenant architecture
    optimizePackageImports: [
      "lucide-react",
      "@radix-ui/react-icons",
      "date-fns",
      "lodash-es",
    ],

    // Enable partial pre-rendering for better performance
    ppr: false, // Set to true when ready for production
  },

  /* TypeScript Configuration */
  typescript: {
    // Dangerously allow production builds to successfully complete even if type errors exist
    ignoreBuildErrors: false,
  },

  /* ESLint Configuration */
  eslint: {
    // Prevent production builds from completing if ESLint errors exist
    ignoreDuringBuilds: false,
  },

  /* Image Optimization */
  images: {
    formats: ["image/webp", "image/avif"],
    domains: [
      "localhost",
      // Add your production domains here
      // 'yourdomain.com',
      // 'cdn.yourdomain.com',
    ],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.amazonaws.com",
        port: "",
        pathname: "**",
      },
      {
        protocol: "https",
        hostname: "**.cloudinary.com",
        port: "",
        pathname: "**",
      },
    ],
  },

  /* Security Headers */
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
      {
        source: "/api/:path*",
        headers: [
          {
            key: "Access-Control-Allow-Origin",
            value:
              process.env.NODE_ENV === "development"
                ? "*"
                : process.env.NEXT_PUBLIC_APP_URL || "",
          },
          {
            key: "Access-Control-Allow-Methods",
            value: "GET, POST, PUT, DELETE, OPTIONS",
          },
          {
            key: "Access-Control-Allow-Headers",
            value: "Content-Type, Authorization, X-Tenant-ID",
          },
        ],
      },
    ];
  },

  /* Multi-tenant Redirects and Rewrites */
  async rewrites() {
    return {
      beforeFiles: [
        // Handle widget embed routes
        {
          source: "/embed/:tenantId*",
          destination: "/widget/embed/:tenantId*",
        },
        // Handle tenant-specific API routes
        {
          source: "/api/tenant/:tenantId/:path*",
          destination: "/api/:path*",
        },
      ],
    };
  },

  /* Environment Variables Validation */
  env: {
    // Public environment variables
    NEXT_PUBLIC_APP_NAME: process.env.NEXT_PUBLIC_APP_NAME,
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
  },

  /* Bundle Analyzer (Development) */
  ...(process.env.ANALYZE === "true" && {
    compiler: {
      removeConsole: process.env.NODE_ENV === "production",
    },
  }),

  /* Webpack Configuration */
  webpack: (
    config: any,
    { buildId, dev, isServer, defaultLoaders, webpack }: any
  ) => {
    // Handle SVG imports
    config.module.rules.push({
      test: /\.svg$/i,
      issuer: /\.[jt]sx?$/,
      use: ["@svgr/webpack"],
    });

    // Optimize for production
    if (!dev && !isServer) {
      config.resolve.alias = {
        ...config.resolve.alias,
        "@": path.resolve(__dirname, "src"),
      };
    }

    // Handle MongoDB in serverless environment
    if (isServer) {
      config.externals.push({
        "mongodb-client-encryption": "mongodb-client-encryption",
      });
    }

    return config;
  },

  /* Output Configuration */
  output: "standalone",

  /* Redirects for Multi-tenancy */
  async redirects() {
    return [
      // Redirect root to landing page
      {
        source: "/",
        destination: "/landing",
        permanent: false,
      },
      // Handle legacy routes
      {
        source: "/dashboard",
        destination: "/overview",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;

import path from 'path';

import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  transpilePackages: ['@habitta/ui', '@habitta/types', '@habitta/utils', '@habitta/database'],
  webpack(config) {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': path.resolve(__dirname),
    };
    return config;
  },
  async rewrites() {
    return {
      beforeFiles: [
        // "/" → muestra /dashboard
        { source: '/', destination: '/dashboard' },
        // "/:path*" → muestra /dashboard/:path*, excepto /login y rutas internas
        {
          source: '/:path((?!login|_next|api|favicon\\.ico).*)',
          destination: '/dashboard/:path',
        },
      ],
    };
  },
};

export default nextConfig;

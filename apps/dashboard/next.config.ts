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
        // "/cualquier/ruta" → muestra /dashboard/cualquier/ruta
        // Excepto: /login, /_next, /api, /favicon.ico
        {
          source: '/:path((?!login|_next|api|favicon\\.ico).+)',
          destination: '/dashboard/:path',
        },
      ],
    };
  },
};

export default nextConfig;

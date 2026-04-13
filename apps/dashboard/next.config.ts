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
};

export default nextConfig;

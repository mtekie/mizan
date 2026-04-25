import type {NextConfig} from 'next';
import path from 'path';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  outputFileTracingRoot: path.join(__dirname, '../../'),
  transpilePackages: ['motion', '@mizan/shared', '@mizan/ui-tokens', '@mizan/api-client'],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'picsum.photos',
      },
      {
        protocol: 'https',
        hostname: 'www.google.com',
      },
    ],
  },
  async redirects() {
    return [
      {
        source: '/money',
        destination: '/ledger',
        permanent: false,
      },
      {
        source: '/find',
        destination: '/catalogue',
        permanent: false,
      },
      {
        source: '/goals',
        destination: '/dreams',
        permanent: false,
      },
      {
        source: '/me',
        destination: '/profile',
        permanent: false,
      },
    ];
  },
};

export default nextConfig;

/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: false,
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  images: {
    // Replace `domains` with `remotePatterns`
    remotePatterns: [
      // Supabase (all public buckets, e.g. divasDB, orders)
      {
        protocol: 'https',
        hostname: 'fsitfoxofpsynhncpxjs.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
      // Local dev uploads from your backend (if you ever render them with <Image/>)
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3001',
        pathname: '/uploads/**',
      },
      // In case you ever serve images via Next at :3000/uploads in dev
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3000',
        pathname: '/uploads/**',
      },
    ],
  },
};

module.exports = nextConfig;
/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // Temporarily ignore ESLint during Vercel builds to unblock deployment.
    ignoreDuringBuilds: false,
  },
  typescript: {
    // Temporarily ignore TypeScript build errors during deployment. Plan: fix types & re-enable.
    ignoreBuildErrors: false,
  },
  images: {
    domains: [
      'fsitfoxofpsynhncpxjs.supabase.co',
      'localhost'
    ],
  },
};

module.exports = nextConfig;

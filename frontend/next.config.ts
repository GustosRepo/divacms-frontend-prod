/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "diva-factory-images.sfo3.digitaloceanspaces.com", // ✅ Your actual DigitalOcean Spaces hostname
      },
      {
        protocol: "http",
        hostname: "localhost", // ✅ Allow local backend images (if needed)
      },
      {
        protocol: "https",
        hostname: "fsitfoxofpsynhncpxjs.supabase.co", // ✅ Supabase storage hostname
      },
    ],
  },
  async rewrites() {
    return [
      { source: '/accessories', destination: '/boutique' },
    ];
  },
};

module.exports = nextConfig;
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: 'cdn.discordapp.com',
      },
      {
        hostname: 'placehold.co',
      },
    ],
  },
};

module.exports = nextConfig;

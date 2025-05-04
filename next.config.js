/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: [
      'cdn.pixabay.com',
      process.env.R2_PUBLIC_URL ? new URL(process.env.R2_PUBLIC_URL).hostname : 'imagetat.getrezult.com',
      'localhost',
      'tattoo.getrezult.com'
    ],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
      }
    ],
  },
  // Ensure uploads directory is properly served in production
  async headers() {
    return [
      {
        source: '/uploads/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=86400',
          }
        ],
      },
    ]
  }
};

module.exports = nextConfig;

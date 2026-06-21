const backendUrl = process.env.BACKEND_INTERNAL_URL || 'http://localhost:8000';

/** @type {import('next').NextConfig} */
const nextConfig = {
  allowedDevOrigins: [
    "10.148.224.205",
  ],
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${backendUrl}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'res.cloudinary.com' },
      { protocol: 'http', hostname: 'localhost', port: '5000', pathname: '/uploads/**' },
      { protocol: 'https', hostname: '**.onrender.com', pathname: '/uploads/**' },
      { protocol: 'https', hostname: '**.vercel.app', pathname: '/uploads/**' },
    ],
  },
};

module.exports = nextConfig;

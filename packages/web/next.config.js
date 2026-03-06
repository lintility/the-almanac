/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
  },
  basePath: process.env.BASE_PATH || '',
  trailingSlash: true,
}

module.exports = nextConfig

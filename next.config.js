/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  images:{
    domains: ['gadest-microblogging-bucket.s3.amazonaws.com'],
    formats: ['image/avif', 'image/webp']
  }
}

module.exports = nextConfig

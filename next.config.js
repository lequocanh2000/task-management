/** @type {import('next').NextConfig} */
const nextConfig = {
  // reactStrictMode: true,
  swcMinify: true,
  env: {
    port: process.env.NEXT_PUBLIC_PORT,
    nodeEnv: process.env.NODE_ENV,
    baseUrl: process.env.BASE_URL,
  },
};

module.exports = nextConfig;

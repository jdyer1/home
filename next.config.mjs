/** @type {import('next').NextConfig} */

const isProd = process.env.NODE_ENV === 'production';
const nextConfig = {
  /* config options here */
  output: 'export',
  ...(isProd ? { basePath: '/home', assetPrefix: '/home/' } : {}),
  reactCompiler: true,
  devIndicators: false
};

export default nextConfig;

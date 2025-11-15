const nextConfig = {
  allowedDevOrigins: [
    process.env.DEV_ORIGIN || 'http://localhost:3000',
    'http://127.0.0.1:3000',
    'http://0.0.0.0:3000',
    'http://192.168.1.28:3000',
  ],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'asadullahqamarbhatti.com',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
      },
    ],
    unoptimized: process.env.NODE_ENV === 'development',
  },
  assetPrefix: undefined,
  basePath: '',
  trailingSlash: false,
  reactStrictMode: true,
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  experimental: {
    optimizeCss: true,
  },
};

export default nextConfig;

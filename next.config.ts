const nextConfig = {
  allowedDevOrigins: [
    process.env.DEV_ORIGIN || 'http://localhost:3000',
    'http://127.0.0.1:3000',
    'http://0.0.0.0:3000',
    'http://192.168.1.28:3000',
  ],
};

export default nextConfig;

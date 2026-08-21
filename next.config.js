/** @type {import('next').NextConfig} */
const nextConfig = {
  // pdf-parse uses Node.js fs module — must run in Node.js runtime (not Edge)
  // Next.js 14 uses experimental.serverComponentsExternalPackages
  experimental: {
    serverComponentsExternalPackages: ['pdf-parse', '@huggingface/inference'],
  },

  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Don't bundle server-only modules on the client side
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        crypto: false,
      };
    }
    return config;
  },
};

module.exports = nextConfig;

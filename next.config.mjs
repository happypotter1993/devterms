import createJiti from 'jiti';

const jiti = createJiti(new URL(import.meta.url).pathname);
jiti('./src/env');

/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true
  },
  typescript: {
    ignoreBuildErrors: true
  },
  experimental: {
    useDeploymentId: true,
    useDeploymentIdServerActions: true
  }
};

export default nextConfig;

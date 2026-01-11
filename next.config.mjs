/** @type {import('next').NextConfig} */
const nextConfig = {
  // TypeScript hataları olsa bile projeyi yayınla
  typescript: {
    ignoreBuildErrors: true,
  },
  // Yazım kuralları (Lint) hatalarını görmezden gel
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
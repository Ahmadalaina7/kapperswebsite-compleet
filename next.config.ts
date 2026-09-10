import type { NextConfig } from 'next';

const config: NextConfig = {
  // Plesk/LiteSpeed hosting has no Node runtime — ship a static site.
  output: 'export',
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
};

export default config;

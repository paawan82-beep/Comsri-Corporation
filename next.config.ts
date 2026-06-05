import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  typescript: {
    ignoreBuildErrors: false,
  },
  turbopack: {},
  // Allow access to remote image placeholder.
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**', // This allows any path under the hostname
      },
      {
        protocol: 'https',
        hostname: 'hglntgfpbilqvdcazjsv.supabase.co',
        port: '',
        pathname: '/**', // This allows any path under the hostname
      },
      {
        protocol: 'https',
        hostname: 'comsri.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'upload.wikimedia.org',
        port: '',
        pathname: '/**',
      },
    ],
  },
  transpilePackages: ['motion'],
  async rewrites() {
    return {
      beforeFiles: [
        { source: '/sitemap.xml', destination: '/sitemap' },
        { source: '/products-sitemap.xml', destination: '/products-sitemap' },
        { source: '/categories-sitemap.xml', destination: '/categories-sitemap' },
        { source: '/blog-sitemap.xml', destination: '/blog-sitemap' },
        { source: '/images-sitemap.xml', destination: '/images-sitemap' },
      ],
    };
  },
  webpack: (config, {dev}) => {
    // HMR is disabled in AI Studio via DISABLE_HMR env var.
    // Do not modify—file watching is disabled to prevent flickering during agent edits.
    if (dev && process.env.DISABLE_HMR === 'true') {
      config.watchOptions = {
        ignored: /.*/,
      };
    }
    return config;
  },
};

export default nextConfig;

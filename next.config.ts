import type {NextConfig} from 'next';

const nextConfig: any = {
  reactStrictMode: true,
  typescript: {
    ignoreBuildErrors: false,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  turbopack: {},
  // Allow access to remote image placeholder.
  images: {
    unoptimized: true,
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
        hostname: 'cms.comsri.com',
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
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Strict-Transport-Security', value: 'max-age=31536000; includeSubDomains; preload' },
          { key: 'X-XSS-Protection', value: '1; mode=block' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
          { key: 'Content-Security-Policy', value: "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://checkout.razorpay.com https://va.vercel-scripts.com; connect-src 'self' https://hglntgfpbilqvdcazjsv.supabase.co https://api.razorpay.com wss://*.supabase.co https://va.vercel-scripts.com https://vitals.vercel-insights.com; img-src 'self' data: https://picsum.photos https://hglntgfpbilqvdcazjsv.supabase.co https://comsri.com https://cms.comsri.com https://images.unsplash.com https://upload.wikimedia.org https://maps.gstatic.com https://*.google.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; frame-src 'self' https://api.razorpay.com https://www.google.com https://maps.google.com;" }
        ]
      }
    ];
  },
  async rewrites() {
    return {
      beforeFiles: [
        { source: '/sitemap.xml', destination: '/sitemap' },
        { source: '/products-sitemap.xml', destination: '/products-sitemap' },
        { source: '/categories-sitemap.xml', destination: '/categories-sitemap' },
        { source: '/blog-sitemap.xml', destination: '/blog-sitemap' },
        { source: '/images-sitemap.xml', destination: '/images-sitemap' },
        { source: '/merchant-feed.xml', destination: '/api/merchant-feed' },
      ],
    };
  },
  webpack: (config: any, {dev}: any) => {
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

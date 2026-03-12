// /** @type {import('next').NextConfig} */
// const nextConfig = {
//   images: {
//     remotePatterns: [
//       {
//         protocol: 'https',
//         hostname: '**.cloudfront.net',
//       },
//       {
//         protocol: 'https',
//         hostname: '**.amazonaws.com',
//       },
//     ],
//   },
// };

// module.exports = nextConfig;






// /** @type {import('next').NextConfig} */
// const nextConfig = {
//   images: {
//     remotePatterns: [
//       {
//         protocol: 'https',
//         hostname: 'd1afw9oa08qpwz.cloudfront.net',
//       },
//       {
//         protocol: 'https',
//         hostname: '**.cloudfront.net',
//       },
//       {
//         protocol: 'https',
//         hostname: '**.amazonaws.com',
//       },
//     ],
//   },
// };



// module.exports = nextConfig;





// /** @type {import('next').NextConfig} */
// const nextConfig = {
//   async headers() {
//     return [
//       {
//         source: '/api/:path*',
//         headers: [
//           { key: 'Access-Control-Allow-Origin', value: '*' },
//           { key: 'Access-Control-Allow-Methods', value: 'GET,POST,PUT,DELETE,OPTIONS' },
//           { key: 'Access-Control-Allow-Headers', value: 'Content-Type, Authorization' },
//         ],
//       },
//     ];
//   },
//   images: {
//     remotePatterns: [
//       { protocol: 'https', hostname: '**.cloudfront.net' },
//       { protocol: 'https', hostname: '**.amazonaws.com' },
//     ],
//   },
// };

// module.exports = nextConfig;




// /** @type {import('next').NextConfig} */
// const nextConfig = {
//   async headers() {
//     return [
//       {
//         source: '/api/:path*',
//         headers: [
//           { key: 'Access-Control-Allow-Origin', value: '*' },
//           { key: 'Access-Control-Allow-Methods', value: 'GET,POST,PUT,DELETE,OPTIONS' },
//           { key: 'Access-Control-Allow-Headers', value: 'Content-Type, Authorization' },
//         ],
//       },
//     ];
//   },
//   images: {
//     remotePatterns: [
//       { protocol: 'https', hostname: '**.cloudfront.net' },
//       { protocol: 'https', hostname: '**.amazonaws.com' },
//     ],
//   },
// };

// module.exports = nextConfig;






/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable the instrumentation hook so src/instrumentation.ts runs on server start
  experimental: {
    instrumentationHook: true,
  },

  // Prevent webpack from trying to bundle Node-only modules used in automation
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals = [
        ...(Array.isArray(config.externals) ? config.externals : []),
        'xml2js',
        'sax',
      ];
    }
    return config;
  },

  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET,POST,PUT,DELETE,OPTIONS' },
          { key: 'Access-Control-Allow-Headers', value: 'Content-Type, Authorization' },
        ],
      },
    ];
  },

  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '**.cloudfront.net' },
      { protocol: 'https', hostname: '**.amazonaws.com' },
      { protocol: 'https', hostname: 'picsum.photos' },
      { protocol: 'https', hostname: 'source.unsplash.com' },
    ],
  },
};

module.exports = nextConfig;
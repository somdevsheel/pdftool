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




/** @type {import('next').NextConfig} */
const nextConfig = {
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
    ],
  },
};

module.exports = nextConfig;
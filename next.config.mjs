/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    missingSuspenseWithCSRBailout: false,
  },
  images: {
    remotePatterns: [
      {
        hostname: "images.unsplash.com",
      },
      {
        hostname: "d3rawx72iic8hc.cloudfront.net",
      },
      {
        hostname: "img.freepik.com",
      },
    ],
  },
};

export default nextConfig;

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: "images.unsplash.com",
      },
      {
        hostname: "dlqkcl6dprptk.cloudfront.net",
      },
    ],
  },
};

export default nextConfig;

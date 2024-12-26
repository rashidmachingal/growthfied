/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
      remotePatterns: [
          {
            protocol: "http",
            hostname: "localhost",
            port: "3001",
            pathname: "**",
          },
          {
            protocol: "http",
            hostname: "192.168.1.14",
            port: "3001",
            pathname: "**",
          },
          {
            protocol: "http",
            hostname: "192.168.1.11",
            port: "3001",
            pathname: "**",
          },
          {
            protocol: "http",
            hostname: "api.growthfied.com",
            pathname: "**",
          },
          {
            protocol: "https",
            hostname: "api.growthfied.com",
            pathname: "**",
          },
        ],
  }
};



export default nextConfig;
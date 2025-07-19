import type { NextConfig } from "next";

const nextConfig: NextConfig = {
images: {
    domains: ["lh3.googleusercontent.com"],
    remotePatterns: [
      {
        protocol: 'http', // Or 'https' if your local server uses HTTPS
        hostname: 'localhost', // The hostname from your error message
        port: '3000', // The port your Next.js app is running on
        pathname: '/uploads/**', // The path where your images are served from (e.g., /uploads/articles/)
      },
      ],
  },
  
};

export default nextConfig;

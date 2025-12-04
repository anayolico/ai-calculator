import withPWA from "next-pwa";

const nextConfig = {
  reactStrictMode: true,

  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**" },
      { protocol: "http", hostname: "**" },
    ],
  },

  typescript: { ignoreBuildErrors: true },
  eslint: { ignoreDuringBuilds: true },
};

export default withPWA({
  dest: "public",       // Where the service worker is generated
  register: true,       // Auto-register service worker
  skipWaiting: true,    // Activate SW immediately
})(nextConfig);

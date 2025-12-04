// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      // your site
      { protocol: "https", hostname: "vaishi.vercel.app" },

      // common CDNs
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "res.cloudinary.com" },
      { protocol: "https", hostname: "imagedelivery.net" },
      { protocol: "https", hostname: "baromarket.in" },
      { protocol: "https", hostname: "i.ytimg.com" },
      { protocol: "https", hostname: "www.artsty.com" },
      { protocol: "https", hostname: "mybageecha.com" },
      { protocol: "https", hostname: "m.media-amazon.com" },
      { protocol: "https", hostname: "asthetika.in" },
      { protocol: "https", hostname: "5.imimg.com" }, // ✅ IndiaMART CDN
    ],
  },
};

export default nextConfig;


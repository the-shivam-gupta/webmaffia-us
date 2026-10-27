/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    dangerouslyAllowLocalIP: process.env.NODE_ENV === "development",
    remotePatterns: [
      // {
      //   protocol: "http",
      //   hostname: "localhost",
      //   port: "1337",
      //   pathname: "/uploads/**",
      // },
      {
        protocol: "https",
        hostname: "cms.webmaffia.com",
        pathname: "/uploads/**",
      },
    ],
  },
  async redirects() {
    return [
      {
        source: "/work",
        destination: "/case-study",
        permanent: true,
      },
      {
        source: "/case-study/hoabl-website-case-study",
        destination: "/case-study/hoabl",
        permanent: true,
      },
      {
        source: "/case-study/lexotique-case-study",
        destination: "/case-study/lexotique",
        permanent: true,
      },
      {
        source: "/case-study/ecovero-case-study",
        destination: "/case-study/ecovero",
        permanent: true,
      },
      {
        source: "/campaigns/:slug",
        destination: "/case-study/:slug",
        permanent: true,
      },
      {
        source: "/case-study/campaigns/:slug",
        destination: "/case-study/:slug",
        permanent: true,
      },
      // Service detail pages moved from top-level routes to /services/:slug.
      // These old URLs are indexed by Google, so redirect them permanently.
      {
        source: "/digital-strategy",
        destination: "/services/digital-strategy",
        permanent: true,
      },
      {
        source: "/website-design-development-services",
        destination: "/services/website-design-development-services",
        permanent: true,
      },
      {
        source: "/search-engine-optimization-services",
        destination: "/services/search-engine-optimization-services",
        permanent: true,
      },
      {
        source: "/content-marketing-strategy",
        destination: "/services/content-marketing-strategy",
        permanent: true,
      },
      {
        source: "/app-store-optimization",
        destination: "/services/app-store-optimization",
        permanent: true,
      },
      {
        source: "/social-media-marketing-strategy",
        destination: "/services/social-media-marketing-strategy",
        permanent: true,
      },
      {
        source: "/ai-powered-solutions-services",
        destination: "/services/ai-powered-solutions-services",
        permanent: true,
      },
      {
        source: "/influencer-marketing",
        destination: "/services/influencer-marketing",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;

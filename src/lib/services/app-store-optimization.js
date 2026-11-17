// Static content for /services/app-store-optimization, taken from the supplied app-store-optimization.html.
// Banner image, banner subtitle, statistics icons, industries, tool logos,
// latest work and blog posts still come from the CMS (see index.js).
import { buildStaticService } from "@/lib/services/build";

const raw = {
  "slug": "app-store-optimization",
  "headingTitle": "App Store Optimization Services",
  "metadata": {
    "title": "App Store Optimization (ASO) Services | Webmaffia",
    "description": "ASO services from Webmaffia that grow visibility and installs on the App Store and Google Play: keywords, metadata, creatives, testing and reviews."
  },
  "hero": {
    "title": "App Store Optimization Services",
    "description": [
      "Most app installs still start with a search inside the store. If your app isn't in the first few results for the words people type, or your icon and screenshots don't convince them in a few seconds, they install a competitor and never come back.",
      "Webmaffia's ASO team works on both sides of the store: getting your app found on the Apple App Store and Google Play through keyword and metadata optimisation, and getting it chosen through creatives, ratings and reviews. We also make sure your app's web presence answers questions so search engines and AI assistants recommend it."
    ]
  },
  "intro": {
    "heading": "What Is App Store Optimization (ASO)?",
    "paragraphs": [
      "App Store Optimization (ASO) is the process of improving an app's visibility and conversion rate in app stores such as the Apple App Store and Google Play. It covers keyword research, app title and metadata, icons, screenshots and preview videos, ratings and reviews, and testing, so more of the right users find, choose and keep your app."
    ]
  },
  "offerings": {
    "heading": "Our App Store Optimization Services",
    "items": [
      {
        "title": "ASO Audit & Competitor Benchmarking",
        "description": "We review your store listings against the apps that already rank for the searches you want: their keywords, titles, creatives, ratings, update cadence and reviews. You get a clear list of gaps and quick wins for both stores before any changes go live."
      },
      {
        "title": "Keyword Research & Metadata Optimisation",
        "description": "The two stores index text differently. On the App Store, we prioritise the title, subtitle and the 100-character keyword field. On Google Play, we optimise the title, the 80-character short description and the full description, which Google Play also indexes. Keywords are chosen by relevance, search volume and how winnable they are."
      },
      {
        "title": "Creative Optimisation",
        "description": "Icons, screenshots and preview videos decide whether a visitor installs. We design creative sets that explain your value in the first two screenshots, show the product clearly and match what users searched for, and localise them for each market."
      },
      {
        "title": "A/B Testing & Custom Store Pages",
        "description": "We test icons, screenshots and copy with Apple's product page optimization and Google Play's store listing experiments, and build custom product pages and custom store listings for specific campaigns, audiences or keywords, so every ad and search lands on the most relevant page."
      },
      {
        "title": "Ratings, Reviews & Reputation",
        "description": "Ratings influence both ranking and conversion. We plan in-app rating prompts at the right moments, set up review monitoring and response playbooks, and turn recurring feedback into product and listing improvements."
      },
      {
        "title": "Localisation & Market Expansion",
        "description": "We adapt keywords, copy and creatives for each language and market rather than translating word for word, so your app is relevant to local searches in India, the Middle East and beyond."
      },
      {
        "title": "App Web Visibility & AI Answers",
        "description": "People also ask Google and AI assistants which app to use. We build and optimise your app landing pages, FAQs and structured data, and earn mentions on credible review and comparison sites, so search engines and AI models have good reasons to recommend your app."
      }
    ]
  },
  "tools": {
    "heading": "App Store Optimization Tools We Use",
    "groups": [
      {
        "title": "Keyword & Market Research",
        "tools": [
          {
            "name": "AppTweak"
          },
          {
            "name": "Sensor Tower"
          },
          {
            "name": "MobileAction"
          },
          {
            "name": "Google Play Console"
          }
        ]
      },
      {
        "title": "Store Management",
        "tools": [
          {
            "name": "App Store Connect"
          },
          {
            "name": "Google Play Console"
          },
          {
            "name": "Custom product pages"
          },
          {
            "name": "Custom store listings"
          }
        ]
      },
      {
        "title": "Creative & Testing",
        "tools": [
          {
            "name": "Figma"
          },
          {
            "name": "Adobe Creative Cloud"
          },
          {
            "name": "Product page optimization"
          },
          {
            "name": "Store listing experiments"
          }
        ]
      },
      {
        "title": "Reviews & Reputation",
        "tools": [
          {
            "name": "AppFollow"
          },
          {
            "name": "App Store Connect reviews"
          },
          {
            "name": "Play Console reviews"
          },
          {
            "name": "Sentiment tagging"
          }
        ]
      },
      {
        "title": "Analytics & Reporting",
        "tools": [
          {
            "name": "Firebase"
          },
          {
            "name": "Google Analytics 4"
          },
          {
            "name": "App Store Connect analytics"
          },
          {
            "name": "Looker Studio"
          }
        ]
      }
    ]
  },
  "why": {
    "heading": "Why Brands Choose Webmaffia for App Store Optimization",
    "items": [
      "ASO, design, SEO, content and app development sit under one roof, so store listings, creatives and the app itself improve together.",
      "Experience across pharma, real estate, energy, D2C and financial services apps, with offices in Mumbai, Bengaluru and Dubai.",
      "We optimise for both stores and for the web, so your app is found in store search, Google and AI answers.",
      "Monthly reporting on keyword rankings, impressions, conversion rate, installs and ratings, so you can see what's moving."
    ]
  },
  "process": {
    "heading": "Our App Store Optimization Process",
    "items": [
      {
        "title": "Discovery & Audit",
        "text": "Store listings, keywords, creatives, reviews and competitor benchmarks."
      },
      {
        "title": "Strategy & Keyword Map",
        "text": "Priority keywords per store and market, creative direction and testing plan."
      },
      {
        "title": "Optimise & Test",
        "text": "Metadata, creatives and custom pages, with A/B tests in both stores."
      },
      {
        "title": "Reviews & Web Visibility",
        "text": "Rating prompts, review responses, landing pages and mentions for AI answers."
      },
      {
        "title": "Measure & Iterate",
        "text": "Monthly reporting on rankings, conversion, installs and ratings."
      }
    ]
  },
  "blogCategories": [
    "App Store Optimization"
  ],
  "faqHeading": "Frequently asked questions",
  "faqs": [
    {
      "question": "What is App Store Optimization?",
      "answer": "App Store Optimization (ASO) is improving an app's visibility and conversion in the Apple App Store and Google Play through keyword research, metadata, creatives, ratings and reviews, and testing, so more of the right users find and install it."
    },
    {
      "question": "What is the difference between ASO and SEO?",
      "answer": "SEO improves a website's visibility in search engines such as Google. ASO improves an app's visibility inside app stores. The principles are similar, but the ranking factors differ: ASO relies heavily on app metadata, installs, ratings and engagement."
    },
    {
      "question": "How long does ASO take to show results?",
      "answer": "Metadata changes can affect rankings within a few weeks of a release, especially on Google Play. Meaningful, lasting improvements usually build over 2 to 3 months of testing and iteration."
    },
    {
      "question": "Do Apple and Google Play rank apps differently?",
      "answer": "Yes. The App Store mainly uses the title, subtitle and a hidden keyword field, while Google Play also reads the full description. Each store has its own testing tools, so we run separate strategies for each."
    },
    {
      "question": "Do ratings and reviews affect ASO?",
      "answer": "Yes. Ratings and reviews influence both ranking and whether users install. We plan in-app rating prompts, monitor reviews and respond to them, and use feedback to improve the app and listing."
    },
    {
      "question": "How much do ASO services cost?",
      "answer": "It depends on the number of apps, stores, markets and languages, and whether creative production and testing are included. We scope a custom plan after an audit."
    }
  ],
  "otherServices": [
    {
      "title": "Digital Strategy",
      "href": "/services/digital-strategy"
    },
    {
      "title": "SEO",
      "href": "/services/search-engine-optimization-services"
    },
    {
      "title": "Social media",
      "href": "/services/social-media-marketing-strategy"
    },
    {
      "title": "Design and development",
      "href": "/services/website-design-development-services"
    },
    {
      "title": "AI-Powered Solutions",
      "href": "/services/ai-powered-solutions-services"
    },
    {
      "title": "Content Marketing",
      "href": "/services/content-marketing-strategy"
    },
    {
      "title": "Influencer Marketing",
      "href": "/services/influencer-marketing"
    }
  ]
};

export default buildStaticService(raw);

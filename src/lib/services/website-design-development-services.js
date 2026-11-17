// Static content for /services/website-design-development-services, taken from the supplied website-design-development-services.html.
// Banner image, banner subtitle, statistics icons, industries, tool logos,
// latest work and blog posts still come from the CMS (see index.js).
import { buildStaticService } from "@/lib/services/build";

const raw = {
  "slug": "website-design-development-services",
  "headingTitle": "Website Design & Development Services",
  "metadata": {
    "title": "Website Design & Development Services | Webmaffia",
    "description": "Website design and development from Webmaffia: UX, UI, Next.js builds, CMS, speed, security and SEO-ready sites built to rank, convert and get cited by AI."
  },
  "hero": {
    "title": "Website Design & Development Services",
    "description": [
      "Your website is now read by two audiences. People decide in seconds whether it looks credible and answers their question. Search engines and AI models decide whether it is fast, structured and trustworthy enough to rank or quote. A site that only pleases one of them leaves revenue on the table.",
      "Webmaffia designs and builds websites for both: research-led UX, distinctive UI, fast and secure Next.js and React builds, a CMS your team can actually use, and SEO, structured data and AI-crawler access built in from the first line of code, not patched on after launch."
    ]
  },
  "intro": {
    "heading": "What Is Website Design and Development?",
    "paragraphs": [
      "Website design and development is the process of planning, designing and building a website. Design covers user research, information architecture, user experience (UX) and visual interface (UI). Development turns that design into a fast, secure, accessible and search-friendly site, connected to a content management system and the business tools behind it."
    ]
  },
  "offerings": {
    "heading": "Our Website Design & Development Services",
    "items": [
      {
        "title": "Discovery, UX Research & Information Architecture",
        "description": "Every build starts with your users, your competitors and your goals. We map audiences, user journeys, content and search demand, then design a sitemap and page structure that makes it easy for people to find answers and for search engines to understand what each page is about."
      },
      {
        "title": "UI Design & Design Systems",
        "description": "We design distinctive, on-brand interfaces in Figma, with wireframes, prototypes and a reusable design system of colours, typography and components. Every page is designed mobile-first and tested for clarity, accessibility and conversion before development starts."
      },
      {
        "title": "Website Development",
        "description": "We build with Next.js and React for speed, security and scale, using server-side rendering so content is visible to search engines and AI crawlers on the first request. Code is clean, documented and tested across browsers and devices."
      },
      {
        "title": "CMS Integration",
        "description": "Your team should be able to update pages without a developer. We integrate headless CMS platforms such as Strapi, or WordPress where it suits, with structured content models, page templates, roles and approval workflows."
      },
      {
        "title": "Performance, Accessibility & Core Web Vitals",
        "description": "Fast sites rank better and convert better. We optimise images, code and hosting for Core Web Vitals, and follow WCAG accessibility guidelines so the site works for everyone, including people using screen readers and keyboards."
      },
      {
        "title": "SEO, Structured Data & AI-Ready Builds",
        "description": "Every site launches with clean URLs, metadata, canonical tags, XML sitemaps, schema markup, robots.txt and llms.txt set up for search engines and AI crawlers such as GPTBot, ClaudeBot and PerplexityBot. Content templates follow an answer-first structure that Google AI Overviews and generative tools can extract."
      },
      {
        "title": "Security, Hosting & Ongoing Support",
        "description": "Our parent company is ISO/IEC 27001:2022 certified. We build with SSL, secure hosting, backups, monitoring and regular updates, and offer ongoing support for content changes, new features and performance improvements after launch."
      }
    ]
  },
  "tools": {
    "heading": "Website Design & Development Tools We Use",
    "groups": [
      {
        "title": "Design & Prototyping",
        "tools": [
          {
            "name": "Figma"
          },
          {
            "name": "FigJam"
          },
          {
            "name": "Adobe Creative Cloud"
          },
          {
            "name": "Design systems"
          }
        ]
      },
      {
        "title": "Development",
        "tools": [
          {
            "name": "Next.js"
          },
          {
            "name": "React"
          },
          {
            "name": "Node.js"
          },
          {
            "name": "Tailwind CSS"
          }
        ]
      },
      {
        "title": "CMS & Integrations",
        "tools": [
          {
            "name": "Strapi"
          },
          {
            "name": "WordPress"
          },
          {
            "name": "CRM integrations"
          },
          {
            "name": "Marketing automation"
          }
        ]
      },
      {
        "title": "Performance & Quality",
        "tools": [
          {
            "name": "Lighthouse"
          },
          {
            "name": "PageSpeed Insights"
          },
          {
            "name": "WAVE accessibility"
          },
          {
            "name": "BrowserStack"
          }
        ]
      },
      {
        "title": "Hosting & Analytics",
        "tools": [
          {
            "name": "Vercel"
          },
          {
            "name": "AWS"
          },
          {
            "name": "Google Analytics 4"
          },
          {
            "name": "Google Search Console"
          }
        ]
      }
    ]
  },
  "why": {
    "heading": "Why Brands Choose Webmaffia for Website Design & Development",
    "items": [
      "Strategy, UX, design, development, SEO and content sit under one roof, so nothing is lost in handoffs between agencies.",
      "We have built websites with SEO for brands such as AFCONS, Summit Digitel, Lupin US and SS Automation, across pharma, infrastructure, energy and manufacturing.",
      "SEO, structured data and AI-crawler access are built into every launch, not added after rankings disappoint.",
      "Secure by default, delivered by an ISO/IEC 27001:2022 certified company with support after launch."
    ]
  },
  "process": {
    "heading": "Our Website Design & Development Process",
    "items": [
      {
        "title": "Discover & Plan",
        "text": "Goals, users, competitors, content and search research."
      },
      {
        "title": "UX & Architecture",
        "text": "Sitemap, user journeys, wireframes and content models."
      },
      {
        "title": "Design",
        "text": "UI, design system and clickable prototypes, reviewed with your team."
      },
      {
        "title": "Develop & Test",
        "text": "Next.js build, CMS, integrations, SEO setup, performance and accessibility testing."
      },
      {
        "title": "Launch & Grow",
        "text": "Migration, redirects, go-live, monitoring and ongoing improvements."
      }
    ]
  },
  "blogCategories": [
    "Website Design",
    "Development"
  ],
  "faqHeading": "Frequently asked questions",
  "faqs": [
    {
      "question": "What do website design and development services include?",
      "answer": "They include discovery and UX research, information architecture, UI design, front-end and back-end development, CMS integration, SEO and structured data setup, testing, launch and ongoing support. Webmaffia also prepares every site for AI search and AI crawlers."
    },
    {
      "question": "How long does it take to design and build a website?",
      "answer": "It depends on the number of pages, templates, integrations and content. A focused marketing site is quicker than a large corporate site with multiple business units and integrations. We share a realistic timeline after discovery."
    },
    {
      "question": "Which platforms do you build websites on?",
      "answer": "We build with Next.js and React, and integrate CMS platforms such as Strapi and WordPress, depending on your content, team and integrations."
    },
    {
      "question": "Will our new website be SEO-friendly and AI-ready?",
      "answer": "Yes. We launch with clean URLs, metadata, canonical tags, sitemaps, schema markup, fast Core Web Vitals and crawler access for search engines and AI models. No agency can guarantee a specific ranking, but the technical foundation will not hold you back."
    },
    {
      "question": "Will we lose rankings when we redesign our website?",
      "answer": "Not if the migration is planned. We map old URLs to new ones, set up 301 redirects, keep valuable content and monitor Search Console after launch to protect existing rankings."
    },
    {
      "question": "How much does a website cost?",
      "answer": "It depends on scope, design complexity, number of templates, content, integrations and support. We give a scoped estimate after a discovery call."
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
      "title": "AI-Powered Solutions",
      "href": "/services/ai-powered-solutions-services"
    },
    {
      "title": "Content Marketing",
      "href": "/services/content-marketing-strategy"
    },
    {
      "title": "App Store Optimization",
      "href": "/services/app-store-optimization"
    },
    {
      "title": "Influencer Marketing",
      "href": "/services/influencer-marketing"
    }
  ]
};

export default buildStaticService(raw);

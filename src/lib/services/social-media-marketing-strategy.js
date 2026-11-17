// Static content for /services/social-media-marketing-strategy, taken from the supplied social-media-marketing-strategy.html.
// Banner image, banner subtitle, statistics icons, industries, tool logos,
// latest work and blog posts still come from the CMS (see index.js).
import { buildStaticService } from "@/lib/services/build";

const raw = {
  "slug": "social-media-marketing-strategy",
  "headingTitle": "Social Media Marketing Services",
  "metadata": {
    "title": "Social Media Marketing Services in Mumbai | Webmaffia",
    "description": "Social media marketing services from Webmaffia: strategy, content, community, paid social and social search that grow reach, leads and AI visibility."
  },
  "hero": {
    "title": "Social Media Marketing Services",
    "description": [
      "Your customers don't just scroll social feeds any more. They search them. They type \"best skincare for oily skin\" into Instagram, check a company's LinkedIn before a sales call, and watch three YouTube reviews before they buy. AI assistants read the same conversations when they decide which brands to recommend.",
      "Webmaffia runs social media as a business channel, not a posting schedule: a strategy tied to revenue, content built for each platform, communities that talk back, paid social that scales what works, and social search optimisation so you show up when people and AI models go looking."
    ]
  },
  "intro": {
    "heading": "What Is Social Media Marketing?",
    "paragraphs": [
      "Social media marketing is the planned use of platforms such as Instagram, LinkedIn, YouTube, Facebook and X to build brand awareness, trust and demand. It combines a strategy, platform-native content, community management, paid social and measurement, so that every post, reel and conversation moves people closer to becoming customers."
    ]
  },
  "offerings": {
    "heading": "Our Social Media Marketing Services",
    "items": [
      {
        "title": "Social Media Strategy & Audit",
        "description": "Every engagement starts with an audit of your channels and the 3–5 competitors your audience already follows. We look at what they post, what earns saves and shares rather than vanity likes, and where the white space is. The output is a platform-by-platform strategy with clear roles: which channel builds awareness, which drives consideration and which converts, each with goals tied to your funnel."
      },
      {
        "title": "Platform-Native Content Creation",
        "description": "A LinkedIn carousel, an Instagram reel and a YouTube Short are different formats with different hooks. Our designers, writers and video editors build content for each platform's format and audience, from thumb-stopping first frames to captions that answer a real question. We plan monthly calendars around your launches, moments and evergreen themes so the feed never goes quiet."
      },
      {
        "title": "Community Management & Social Listening",
        "description": "Social is a two-way channel, and unanswered comments cost trust. We manage replies, DMs and reviews to agreed response times and escalation rules, and use social listening to track what people say about your brand, competitors and category. Those insights feed back into content, product and customer service."
      },
      {
        "title": "Paid Social Advertising",
        "description": "Organic reach finds what works; paid social scales it. We plan, build and optimise campaigns on Meta, LinkedIn, YouTube and X, from audience and creative testing to lead forms and retargeting. Budgets follow results, and every campaign is tracked to the leads, sales or sign-ups it actually produces."
      },
      {
        "title": "Social SEO & AI Visibility",
        "description": "People search on Instagram, YouTube and LinkedIn the way they search on Google, and AI models increasingly cite social and video content in their answers. We optimise profiles, captions, alt text, video titles, descriptions and on-screen text around the questions your audience asks, so your content is findable on the platform, in Google results and in AI answers."
      },
      {
        "title": "LinkedIn & B2B Social",
        "description": "For B2B brands, LinkedIn is where buyers, partners and talent make up their minds. We run company pages, executive and thought-leadership programmes, employee advocacy and LinkedIn ads that put real expertise in front of decision makers, not recycled stock-photo posts."
      },
      {
        "title": "Reporting & Social Analytics",
        "description": "Monthly reports show reach, engagement quality, follower growth, share of voice, traffic, leads and cost per result side by side, with clear notes on what we will change next month. You see business outcomes, not just a pile of impressions."
      }
    ]
  },
  "tools": {
    "heading": "Social Media Marketing Tools We Use",
    "groups": [
      {
        "title": "Planning & Publishing",
        "tools": [
          {
            "name": "Meta Business Suite"
          },
          {
            "name": "Sprout Social"
          },
          {
            "name": "Hootsuite"
          },
          {
            "name": "Buffer"
          }
        ]
      },
      {
        "title": "Creative & Video",
        "tools": [
          {
            "name": "Adobe Creative Cloud"
          },
          {
            "name": "Figma"
          },
          {
            "name": "Canva"
          },
          {
            "name": "CapCut"
          }
        ]
      },
      {
        "title": "Listening & Insights",
        "tools": [
          {
            "name": "Brandwatch"
          },
          {
            "name": "Talkwalker"
          },
          {
            "name": "Meta Ad Library"
          },
          {
            "name": "Native platform analytics"
          }
        ]
      },
      {
        "title": "Paid Social",
        "tools": [
          {
            "name": "Meta Ads Manager"
          },
          {
            "name": "LinkedIn Campaign Manager"
          },
          {
            "name": "YouTube / Google Ads"
          },
          {
            "name": "X Ads"
          }
        ]
      },
      {
        "title": "Analytics & Reporting",
        "tools": [
          {
            "name": "Google Analytics 4"
          },
          {
            "name": "Looker Studio"
          },
          {
            "name": "UTM tracking"
          },
          {
            "name": "CRM integrations"
          }
        ]
      }
    ]
  },
  "why": {
    "heading": "Why Brands Choose Webmaffia for Social Media Marketing",
    "items": [
      "Strategy, content, design, video and paid social sit under one roof, so your brand doesn't get lost in handoffs between agencies.",
      "Offices in Mumbai, Bengaluru and Dubai, with social work across pharma, real estate, infrastructure, energy, D2C and financial services.",
      "Social search and AI visibility are built into every content plan, not bolted on after reach starts falling.",
      "Monthly reporting that ties engagement to traffic, leads and sales, so you can see what social is really worth."
    ]
  },
  "process": {
    "heading": "Our Social Media Marketing Process",
    "items": [
      {
        "title": "Discovery & Audit",
        "text": "Channel, audience and competitor analysis."
      },
      {
        "title": "Strategy & Calendar",
        "text": "Platform roles, content pillars, KPIs and a monthly calendar."
      },
      {
        "title": "Create & Publish",
        "text": "Platform-native content, community management and paid social, run in monthly sprints."
      },
      {
        "title": "Social Search & AI Layer",
        "text": "Profile, caption and video optimisation so content is found on platforms, Google and AI answers."
      },
      {
        "title": "Measure & Iterate",
        "text": "Monthly reporting on reach, engagement, leads and sales, with clear next steps."
      }
    ]
  },
  "blogCategories": [
    "Social Media"
  ],
  "faqHeading": "Frequently asked questions",
  "faqs": [
    {
      "question": "What does a social media marketing agency do?",
      "answer": "A social media marketing agency plans your strategy, creates platform-specific content, manages your community, runs paid social campaigns and reports on results. At Webmaffia, the same team also optimises your content for social search and AI visibility, so every post works harder."
    },
    {
      "question": "Which social media platforms should my business be on?",
      "answer": "Be where your audience already spends time, and do fewer platforms well. B2B brands usually prioritise LinkedIn and YouTube. Consumer brands usually prioritise Instagram, YouTube and Facebook. We recommend a mix after an audit of your audience, competitors and goals."
    },
    {
      "question": "How long does social media marketing take to show results?",
      "answer": "Paid social can generate leads within weeks. Organic growth in reach, engagement and community usually builds over 3 to 6 months of consistent, well-targeted content. We set realistic monthly milestones during strategy."
    },
    {
      "question": "What is social SEO?",
      "answer": "Social SEO is optimising profiles, captions, hashtags, alt text and video titles and descriptions so your content appears when people search inside platforms such as Instagram, YouTube and LinkedIn, and in Google results. It also makes your content easier for AI assistants to find and cite."
    },
    {
      "question": "How much do social media marketing services cost?",
      "answer": "It depends on the number of platforms, content volume, video production, community management hours and paid media budget. We scope a custom package after understanding your goals rather than offering a flat rate."
    },
    {
      "question": "Do you handle paid social advertising as well?",
      "answer": "Yes. We plan, create and optimise paid campaigns on Meta, LinkedIn, YouTube and X, and track them to leads, sales or sign-ups. Ad spend is billed separately from management fees."
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

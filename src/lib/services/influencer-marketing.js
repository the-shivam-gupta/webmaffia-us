// Static content for /services/influencer-marketing, taken from the supplied influencer-marketing.html.
// Banner image, banner subtitle, statistics icons, industries, tool logos,
// latest work and blog posts still come from the CMS (see index.js).
import { buildStaticService } from "@/lib/services/build";

const raw = {
  "slug": "influencer-marketing",
  "headingTitle": "Influencer Marketing Services",
  "metadata": {
    "title": "Influencer Marketing Services in Mumbai | Webmaffia",
    "description": "Influencer marketing services from Webmaffia: creator discovery and vetting, campaigns, UGC, B2B expert voices, ASCI-compliant disclosures and ROI tracking."
  },
  "hero": {
    "title": "Influencer Marketing Services",
    "description": [
      "People trust people more than ads. A creator's honest review, an engineer's LinkedIn post or a doctor's explainer can do in a week what a banner campaign struggles to do in a quarter. Those same conversations are increasingly what AI assistants read when they decide which brands to recommend.",
      "Webmaffia runs influencer marketing with the same discipline as any performance channel: creators chosen on audience fit and credibility rather than follower count, clear briefs, compliant disclosures, content you can reuse, and tracking that shows what each partnership actually delivered."
    ]
  },
  "intro": {
    "heading": "What Is Influencer Marketing?",
    "paragraphs": [
      "Influencer marketing is a partnership between a brand and creators, experts or respected voices who have the trust of a specific audience. Creators produce content about the brand, such as reviews, tutorials, reels or LinkedIn posts, to build awareness, credibility and sales, with the commercial relationship clearly disclosed."
    ]
  },
  "offerings": {
    "heading": "Our Influencer Marketing Services",
    "items": [
      {
        "title": "Influencer Strategy & Campaign Planning",
        "description": "We start with your goal (awareness, consideration, launch, sales or app installs) and work back to the right mix of creator tiers, platforms, formats and budget. Each campaign gets clear KPIs, timelines and a measurement plan before a single creator is contacted."
      },
      {
        "title": "Creator Discovery & Vetting",
        "description": "Follower counts are easy to inflate. We vet creators on audience demographics, engagement quality, content style, past brand work, brand safety and signs of fake followers, so your budget reaches real people who match your customers."
      },
      {
        "title": "Campaign Management & Briefing",
        "description": "We handle outreach, negotiation, contracts, briefs, product seeding, content approvals and publishing schedules. Briefs give creators the key messages and rules while leaving room for their own voice, which is what their audience trusts."
      },
      {
        "title": "UGC & Content Amplification",
        "description": "The best creator content shouldn't disappear after 24 hours. With the right usage rights, we turn it into ads, website content, product page assets and social posts, and use partnership ads on Meta to put creator content in front of new audiences."
      },
      {
        "title": "B2B, LinkedIn & Expert Influencers",
        "description": "For B2B and regulated categories, influence comes from expertise. We partner with industry experts, analysts, doctors, engineers and respected LinkedIn voices, and build employee advocacy programmes that let your own people share credible stories."
      },
      {
        "title": "Compliance & Brand Safety",
        "description": "Every collaboration follows the Advertising Standards Council of India (ASCI) influencer guidelines and the Government of India's endorsement guidelines, including clear disclosure labels such as #ad or #collab. For health and financial topics, we only work with creators who meet the qualification and registration requirements that apply."
      },
      {
        "title": "Performance Tracking & ROI",
        "description": "Unique links, promo codes, UTM tracking and platform insights show reach, engagement, traffic, sign-ups and sales for every creator. Monthly and post-campaign reports tell you which partnerships to scale and which to drop."
      }
    ]
  },
  "tools": {
    "heading": "Influencer Marketing Tools We Use",
    "groups": [
      {
        "title": "Discovery & Vetting",
        "tools": [
          {
            "name": "Qoruz"
          },
          {
            "name": "Modash"
          },
          {
            "name": "HypeAuditor"
          },
          {
            "name": "Native creator marketplaces"
          }
        ]
      },
      {
        "title": "Campaign Management",
        "tools": [
          {
            "name": "Contracts & usage rights"
          },
          {
            "name": "Content approval workflows"
          },
          {
            "name": "Notion"
          },
          {
            "name": "Google Workspace"
          }
        ]
      },
      {
        "title": "Amplification",
        "tools": [
          {
            "name": "Meta partnership ads"
          },
          {
            "name": "YouTube BrandConnect"
          },
          {
            "name": "LinkedIn Thought Leader Ads"
          },
          {
            "name": "Meta Ads Manager"
          }
        ]
      },
      {
        "title": "Compliance",
        "tools": [
          {
            "name": "ASCI influencer guidelines"
          },
          {
            "name": "Endorsement guidelines"
          },
          {
            "name": "Disclosure checklists"
          },
          {
            "name": "Brand safety checks"
          }
        ]
      },
      {
        "title": "Tracking & Reporting",
        "tools": [
          {
            "name": "UTM tracking"
          },
          {
            "name": "Promo codes"
          },
          {
            "name": "Google Analytics 4"
          },
          {
            "name": "Looker Studio"
          }
        ]
      }
    ]
  },
  "why": {
    "heading": "Why Brands Choose Webmaffia for Influencer Marketing",
    "items": [
      "Influencer, social, content and paid media sit under one roof, so creator content is planned, amplified and measured as one campaign.",
      "Creator networks and campaign experience across consumer and B2B categories, with offices in Mumbai, Bengaluru and Dubai.",
      "Compliance first: ASCI disclosures, usage rights and qualification checks are part of every brief.",
      "Reporting on reach, engagement, traffic and sales by creator, so you know exactly what your budget delivered."
    ]
  },
  "process": {
    "heading": "Our Influencer Marketing Process",
    "items": [
      {
        "title": "Discovery & Goals",
        "text": "Audience, objectives, budget and success metrics."
      },
      {
        "title": "Strategy & Creator Shortlist",
        "text": "Creator tiers, platforms, formats and vetted shortlists."
      },
      {
        "title": "Brief, Contract & Create",
        "text": "Outreach, contracts, briefs, approvals and publishing."
      },
      {
        "title": "Amplify & Reuse",
        "text": "Partnership ads, UGC on your site and social, and content for AI-visible pages."
      },
      {
        "title": "Measure & Optimise",
        "text": "Creator-level reporting on reach, engagement, traffic and sales."
      }
    ]
  },
  "blogCategories": [
    "Influencer Marketing"
  ],
  "faqHeading": "Frequently asked questions",
  "faqs": [
    {
      "question": "What does an influencer marketing agency do?",
      "answer": "An influencer marketing agency plans campaigns, finds and vets creators, negotiates and manages partnerships, ensures compliant disclosures, amplifies the content and reports on results. It saves you the time and risk of managing many creators yourself."
    },
    {
      "question": "How do you choose the right influencers for a brand?",
      "answer": "We look at audience fit, engagement quality, content style, credibility, past brand work and brand safety, and check for fake followers. Follower count matters less than whether the creator's audience matches your customers and trusts them."
    },
    {
      "question": "Are nano and micro influencers better than celebrities?",
      "answer": "They do different jobs. Nano and micro creators often deliver higher engagement and trust within a niche at a lower cost. Celebrities and macro creators bring scale and fast awareness. Most campaigns use a mix."
    },
    {
      "question": "What are the ASCI rules for influencer marketing in India?",
      "answer": "ASCI guidelines require influencers to clearly disclose paid or material connections with a label such as #ad, #collab or #sponsored that is easy to see. Health and financial influencers must also meet additional qualification or registration requirements. We build these into every brief."
    },
    {
      "question": "Does influencer marketing work for B2B brands?",
      "answer": "Yes, when it focuses on credibility. Industry experts, analysts, engineers and respected LinkedIn voices, plus employee advocacy, can reach decision makers more effectively than ads alone."
    },
    {
      "question": "How much does influencer marketing cost?",
      "answer": "It depends on creator tiers, number of creators, platforms, content formats, usage rights and amplification budget. We scope a custom plan after understanding your goals."
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
      "title": "App Store Optimization",
      "href": "/services/app-store-optimization"
    }
  ]
};

export default buildStaticService(raw);

// Static content for /services/content-marketing-strategy, taken from the supplied content-marketing-strategy.html.
// Banner image, banner subtitle, statistics icons, industries, tool logos,
// latest work and blog posts still come from the CMS (see index.js).
import { buildStaticService } from "@/lib/services/build";

const raw = {
  "slug": "content-marketing-strategy",
  "headingTitle": "Content Marketing Services",
  "metadata": {
    "title": "Content Marketing Services in Mumbai | Webmaffia",
    "description": "Content marketing services from Webmaffia: strategy, SEO content, thought leadership, video and AEO/GEO formats that earn rankings, AI citations and leads."
  },
  "hero": {
    "title": "Content Marketing Services",
    "description": [
      "Content used to be judged by one question: does it rank? Now there's a second: does an AI model trust it enough to quote it? Google AI Overviews, ChatGPT, Gemini and Perplexity summarise the web for your buyers, and they lift from content that answers clearly, proves expertise and is cited elsewhere.",
      "Webmaffia builds content that wins on both scoreboards: a strategy rooted in what your audience actually asks, expert-led articles, guides, case studies and video, structured so search engines can rank it and AI models can cite it, then distributed so it doesn't sit unread on a blog page."
    ]
  },
  "intro": {
    "heading": "What Is Content Marketing?",
    "paragraphs": [
      "Content marketing is creating and distributing useful, relevant content, such as articles, guides, case studies, videos and newsletters, that attracts a defined audience, earns its trust and moves it towards becoming a customer. Instead of interrupting people with ads, it answers the questions they are already asking."
    ]
  },
  "offerings": {
    "heading": "Our Content Marketing Services",
    "items": [
      {
        "title": "Content Strategy & Audit",
        "description": "We audit what you already have, what's working and what's dead weight, then map it against your competitors and your buyers' questions at every stage of the funnel. The result is a content strategy with clear pillars, topic clusters, formats, owners and KPIs, not a list of blog titles."
      },
      {
        "title": "SEO Content & Topic Clusters",
        "description": "We build pillar pages and supporting articles around keyword and intent research, linked together so search engines understand your expertise on a topic. Every piece is briefed with the questions it must answer, the entities it must cover and the internal links it must carry."
      },
      {
        "title": "AEO/GEO Content Formatting",
        "description": "Answer first, then explain. We structure content with direct answers in the first two sentences, question-led headings, summaries, tables, FAQs and schema, which are the formats Google AI Overviews, ChatGPT, Gemini and Perplexity lift from. This is Answer Engine and Generative Engine Optimization built into the writing, not added later."
      },
      {
        "title": "Thought Leadership & Expert Content",
        "description": "AI models and Google both reward first-hand experience. We interview your leaders and specialists and turn their knowledge into bylined articles, LinkedIn posts, reports and opinion pieces with clear author credentials, which strengthens E-E-A-T and makes your brand the source others quote."
      },
      {
        "title": "Case Studies, Whitepapers & Original Research",
        "description": "Original data and real results are the content most likely to earn links, press mentions and AI citations. We produce case studies, reports, surveys and whitepapers that give journalists, buyers and AI models a reason to reference you."
      },
      {
        "title": "Video & Visual Content",
        "description": "Explainers, product videos, short-form clips, infographics and carousels turn complex ideas into something people will watch and share. We script, design and edit for each channel, and add titles, descriptions and transcripts so the content is searchable."
      },
      {
        "title": "Content Distribution & Refresh",
        "description": "Publishing is half the job. We repurpose each piece across social, email, LinkedIn and partner channels, and run a regular refresh cycle so older content stays accurate, current and competitive in search and AI answers."
      }
    ]
  },
  "tools": {
    "heading": "Content Marketing Tools We Use",
    "groups": [
      {
        "title": "Research & Planning",
        "tools": [
          {
            "name": "Ahrefs"
          },
          {
            "name": "Semrush"
          },
          {
            "name": "AnswerThePublic"
          },
          {
            "name": "Google Search Console"
          }
        ]
      },
      {
        "title": "Writing & Optimisation",
        "tools": [
          {
            "name": "Surfer SEO"
          },
          {
            "name": "Clearscope"
          },
          {
            "name": "Frase"
          },
          {
            "name": "Grammarly"
          }
        ]
      },
      {
        "title": "Design & Video",
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
            "name": "Descript"
          }
        ]
      },
      {
        "title": "Publishing & Workflow",
        "tools": [
          {
            "name": "Strapi"
          },
          {
            "name": "WordPress"
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
        "title": "Analytics & Reporting",
        "tools": [
          {
            "name": "Google Analytics 4"
          },
          {
            "name": "Looker Studio"
          },
          {
            "name": "Schema validator"
          },
          {
            "name": "AI citation tracking"
          }
        ]
      }
    ]
  },
  "why": {
    "heading": "Why Brands Choose Webmaffia for Content Marketing",
    "items": [
      "Strategy, SEO, writing, design and video sit under one roof, so content is planned, made and optimised by one team.",
      "Writers and editors who work with subject experts across pharma, real estate, infrastructure, energy, D2C and financial services.",
      "AEO/GEO formatting is part of every brief, so content is built to be cited by AI models from the first draft.",
      "Monthly reporting shows rankings, traffic and leads alongside AI citation visibility."
    ]
  },
  "process": {
    "heading": "Our Content Marketing Process",
    "items": [
      {
        "title": "Discovery & Audit",
        "text": "Content inventory, audience questions and competitor gaps."
      },
      {
        "title": "Strategy & Calendar",
        "text": "Pillars, topic clusters, formats and a publishing calendar."
      },
      {
        "title": "Create & Review",
        "text": "Expert interviews, writing, design and video, with your approvals built in."
      },
      {
        "title": "Optimise for AI Visibility",
        "text": "Answer-first structure, FAQs, schema and author credentials for AI citations."
      },
      {
        "title": "Distribute, Measure & Refresh",
        "text": "Repurposing across channels, monthly reporting and regular content updates."
      }
    ]
  },
  "blogCategories": [
    "Content Marketing"
  ],
  "faqHeading": "Frequently asked questions",
  "faqs": [
    {
      "question": "What do content marketing services include?",
      "answer": "They usually include content strategy, SEO research, writing, design and video production, publishing, distribution and reporting. Webmaffia also formats every piece for AEO and GEO, so it can be cited in Google AI Overviews, ChatGPT, Gemini and Perplexity."
    },
    {
      "question": "How is content marketing different from SEO?",
      "answer": "SEO makes a website easy to find and rank. Content marketing creates the material that earns those rankings, builds trust and converts readers. They work best together: SEO tells you what to create, and content gives SEO something worth ranking."
    },
    {
      "question": "How do you make content show up in AI answers?",
      "answer": "Put a direct answer near the top, use question-led headings, add FAQs, tables and schema, show real expertise with named authors, and earn mentions on credible third-party sites. AI crawlers also need access through robots.txt. No one can guarantee a citation, but these steps make it far more likely."
    },
    {
      "question": "How often should we publish new content?",
      "answer": "Consistency matters more than volume. Most brands do well with a steady monthly cadence plus regular refreshes of existing content. We set a frequency based on your goals, competition and review capacity."
    },
    {
      "question": "Do you write content for regulated industries?",
      "answer": "Yes. We work with pharma, healthcare and financial services brands and build your medical, legal or compliance review into the workflow before anything is published."
    },
    {
      "question": "How much do content marketing services cost?",
      "answer": "It depends on content volume, formats such as video or research, subject-matter complexity and distribution scope. We scope a custom plan after understanding your goals."
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

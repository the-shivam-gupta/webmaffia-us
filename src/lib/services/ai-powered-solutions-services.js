// Static content for /services/ai-powered-solutions-services, taken from the supplied ai-powered-solutions-services.html.
// Banner image, banner subtitle, statistics icons, industries, tool logos,
// latest work and blog posts still come from the CMS (see index.js).
import { buildStaticService } from "@/lib/services/build";

const raw = {
  "slug": "ai-powered-solutions-services",
  "headingTitle": "AI-Powered Solutions",
  "metadata": {
    "title": "AI-Powered Solutions & Services in Mumbai | Webmaffia",
    "description": "AI-powered solutions from Webmaffia: AI chatbots and assistants, workflow automation, AI content operations, lead scoring and AI search visibility, built safely."
  },
  "hero": {
    "title": "AI-Powered Solutions",
    "description": [
      "Every business is being told to \"do something with AI\". Most end up with a chatbot nobody uses or a pile of pilots that never reach production. The value isn't in the model. It's in picking the right problem, connecting AI to your own data and processes, and keeping people in control of what it says and does.",
      "Webmaffia builds practical AI solutions for marketing, sales and operations: assistants that answer customers accurately, automations that remove repetitive work, AI-assisted content and lead workflows, and the groundwork that helps your brand show up in AI answers. Each one is scoped to a measurable outcome and reviewed by people."
    ]
  },
  "intro": {
    "heading": "What Are AI-Powered Solutions?",
    "paragraphs": [
      "AI-powered solutions are software tools and workflows that use artificial intelligence, such as large language models, machine learning and automation, to perform tasks that normally need human effort. Examples include chatbots that answer questions, assistants that search documents, systems that score and route leads, and workflows that draft, tag or summarise content."
    ]
  },
  "offerings": {
    "heading": "Our AI-Powered Solutions",
    "items": [
      {
        "title": "AI Opportunity Assessment & Roadmap",
        "description": "We start with your processes, data and goals, not with a tool. Together we identify where AI can save time, reduce cost or improve customer experience, score each idea by value, feasibility and risk, and agree a roadmap that starts with a focused pilot."
      },
      {
        "title": "AI Chatbots & Virtual Assistants",
        "description": "Website, WhatsApp and in-app assistants that answer customer and employee questions from your approved content. We use retrieval-augmented generation (RAG) so answers come from your own knowledge base, show their sources where useful, and hand over to a human when needed."
      },
      {
        "title": "Workflow & Marketing Automation",
        "description": "We connect AI to your CRM, CMS, email and internal tools to automate repetitive work: routing enquiries, summarising calls and emails, updating records, tagging content and triggering follow-ups, so your team spends time on decisions rather than data entry."
      },
      {
        "title": "AI Content Operations",
        "description": "AI helps your team produce more, faster, without losing quality: content briefs, first drafts, translations, product descriptions, image variations and metadata, all inside a workflow with human editing, brand guidelines and approvals before anything is published."
      },
      {
        "title": "Lead Scoring & Predictive Insights",
        "description": "We use your historical data to score leads, predict which enquiries are most likely to convert and surface trends in customer behaviour, so sales and marketing teams focus on the opportunities that matter most."
      },
      {
        "title": "AI Search Visibility (AEO/GEO)",
        "description": "Customers now ask ChatGPT, Gemini, Perplexity and Google AI Overviews for recommendations. We make your brand easier to find and cite with answer-first content, structured data, llms.txt and robots.txt for AI crawlers, and monitoring of how AI platforms describe your brand."
      },
      {
        "title": "Responsible AI, Security & Governance",
        "description": "Our parent company is ISO/IEC 27001:2022 certified. We design AI solutions with data privacy, access controls, human review, output testing and usage policies, and align data handling with India's DPDP Act and GDPR, so AI stays accurate, safe and on-brand."
      }
    ]
  },
  "tools": {
    "heading": "AI-Powered Solutions Tools We Use",
    "groups": [
      {
        "title": "AI Models",
        "tools": [
          {
            "name": "OpenAI GPT models"
          },
          {
            "name": "Anthropic Claude"
          },
          {
            "name": "Google Gemini"
          },
          {
            "name": "Open-source models"
          }
        ]
      },
      {
        "title": "Build & Orchestration",
        "tools": [
          {
            "name": "Python"
          },
          {
            "name": "Node.js"
          },
          {
            "name": "LangChain"
          },
          {
            "name": "Vector databases"
          }
        ]
      },
      {
        "title": "Automation & Integration",
        "tools": [
          {
            "name": "n8n"
          },
          {
            "name": "Zapier"
          },
          {
            "name": "Make"
          },
          {
            "name": "CRM and CMS APIs"
          }
        ]
      },
      {
        "title": "Conversational Channels",
        "tools": [
          {
            "name": "Website chat"
          },
          {
            "name": "WhatsApp Business Platform"
          },
          {
            "name": "In-app assistants"
          },
          {
            "name": "Microsoft Teams"
          }
        ]
      },
      {
        "title": "Monitoring & Analytics",
        "tools": [
          {
            "name": "Evaluation test sets"
          },
          {
            "name": "Usage dashboards"
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
    "heading": "Why Brands Choose Webmaffia for AI-Powered Solutions",
    "items": [
      "AI, development, content, SEO and design sit under one roof, so AI is built into your website, marketing and workflows rather than bolted on.",
      "Every solution starts with a business outcome and a focused pilot, not a technology experiment.",
      "Human review, testing and governance are built in, with practices from an ISO/IEC 27001:2022 certified company.",
      "We also optimise for AI search, so your brand is visible in the AI platforms your customers use."
    ]
  },
  "process": {
    "heading": "Our AI-Powered Solutions Process",
    "items": [
      {
        "title": "Discover & Assess",
        "text": "Processes, data, goals and risks."
      },
      {
        "title": "Prioritise & Design",
        "text": "Use cases scored by value and feasibility, and solution design."
      },
      {
        "title": "Pilot & Test",
        "text": "A focused pilot with accuracy, safety and user testing."
      },
      {
        "title": "Integrate & Launch",
        "text": "Connection to your systems, training and rollout."
      },
      {
        "title": "Monitor & Improve",
        "text": "Usage, accuracy and ROI reporting, with ongoing improvements."
      }
    ]
  },
  "blogCategories": [
    "AI"
  ],
  "faqHeading": "Frequently asked questions",
  "faqs": [
    {
      "question": "What AI-powered solutions does Webmaffia offer?",
      "answer": "We offer AI opportunity assessments, AI chatbots and virtual assistants, workflow and marketing automation, AI content operations, lead scoring and predictive insights, AI search visibility (AEO/GEO), and responsible AI governance."
    },
    {
      "question": "How can AI help my marketing and sales teams?",
      "answer": "AI can answer common customer questions, qualify and route leads, summarise conversations, update your CRM, speed up content production and highlight the opportunities most likely to convert, which frees your team for higher-value work."
    },
    {
      "question": "Will an AI chatbot give wrong answers to customers?",
      "answer": "Any AI can make mistakes, so we design for accuracy: answers are drawn from your approved content, tested before launch, limited to agreed topics and handed to a human when the assistant is unsure. We monitor and improve answers after launch."
    },
    {
      "question": "Is our data safe when using AI?",
      "answer": "We use access controls, data minimisation and approved AI platforms, avoid sending sensitive data where it isn't needed, and align practices with India's DPDP Act and GDPR. Our parent company is ISO/IEC 27001:2022 certified."
    },
    {
      "question": "How long does it take to build an AI solution?",
      "answer": "A focused pilot can often be built in weeks, depending on data readiness and integrations. Larger rollouts take longer. We agree a timeline after the opportunity assessment."
    },
    {
      "question": "How much do AI solutions cost?",
      "answer": "It depends on the use case, data, integrations, usage volume and support needs. AI platform usage costs are separate from build costs. We share a scoped proposal after discovery."
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

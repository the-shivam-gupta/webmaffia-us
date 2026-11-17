// Static content for /services/digital-strategy, taken from the supplied digital-strategy.html.
// Banner image, banner subtitle, statistics icons, industries, tool logos,
// latest work and blog posts still come from the CMS (see index.js).
import { buildStaticService } from "@/lib/services/build";

const raw = {
  "slug": "digital-strategy",
  "headingTitle": "Digital Strategy Services",
  "metadata": {
    "title": "Digital Strategy Services in Mumbai | Webmaffia",
    "description": "Digital strategy from Webmaffia: research, positioning, channel planning, AI search strategy, roadmaps and KPIs that turn marketing spend into growth."
  },
  "hero": {
    "title": "Digital Strategy Services",
    "description": [
      "Most brands don't have a channel problem. They have a direction problem. A website here, a social calendar there, an ad budget that grows every quarter, and nobody can say which part is actually driving growth. Meanwhile, buyers now research through Google, social feeds and AI assistants before they ever speak to you.",
      "Webmaffia's digital strategy connects the dots: research into your market, customers and competitors, clear positioning, the right mix of channels, a plan for visibility in search and AI answers, and a measurement framework that shows what each rupee and dirham is doing."
    ]
  },
  "intro": {
    "heading": "What Is Digital Strategy?",
    "paragraphs": [
      "Digital strategy is a plan for how a business uses digital channels, such as its website, search, social media, content, apps, paid media and AI, to reach its goals. It defines who the audience is, what the brand should stand for, which channels to prioritise, what to invest, and how success will be measured."
    ]
  },
  "offerings": {
    "heading": "Our Digital Strategy Services",
    "items": [
      {
        "title": "Digital Audit & Competitor Benchmarking",
        "description": "We review your website, search visibility, social channels, content, paid media and analytics, and benchmark them against the competitors your customers compare you with. You get a clear picture of strengths, gaps and quick wins."
      },
      {
        "title": "Audience Research & Customer Journeys",
        "description": "We map who your customers are, what they need, where they look for answers and what makes them choose. That includes the questions they type into search engines and ask AI assistants, so every touchpoint in the journey is planned."
      },
      {
        "title": "Brand Positioning & Messaging",
        "description": "A clear position makes every channel work harder. We define what your brand stands for, why it is different and how it should sound, then turn that into messaging frameworks your teams and agencies can use consistently."
      },
      {
        "title": "Channel Strategy & Media Planning",
        "description": "We decide which channels to prioritise, such as SEO, social, content, paid media, apps, influencers and email, what role each plays in the funnel and how budget should be split, based on your goals and evidence rather than habit."
      },
      {
        "title": "AI Search & Visibility Strategy",
        "description": "Buyers increasingly get answers from Google AI Overviews, ChatGPT, Gemini and Perplexity. We plan how your brand earns visibility there through answer-first content, structured data, AI crawler access, authority building and consistent information across the web."
      },
      {
        "title": "Digital Transformation & MarTech Roadmap",
        "description": "We assess your website platform, CMS, CRM, analytics and automation tools, and plan how they should work together. The roadmap prioritises changes by impact and effort so you invest in what moves the business."
      },
      {
        "title": "KPIs, Measurement & Governance",
        "description": "We set KPIs tied to business outcomes, design dashboards and reporting rhythms, and define who owns what. That makes it easy to see what is working, adjust quickly and keep every team aligned."
      }
    ]
  },
  "tools": {
    "heading": "Digital Strategy Tools We Use",
    "groups": [
      {
        "title": "Research & Insights",
        "tools": [
          {
            "name": "Semrush"
          },
          {
            "name": "Ahrefs"
          },
          {
            "name": "Similarweb"
          },
          {
            "name": "Google Trends"
          }
        ]
      },
      {
        "title": "Audience & Social",
        "tools": [
          {
            "name": "Meta Audience Insights"
          },
          {
            "name": "LinkedIn Insights"
          },
          {
            "name": "Brandwatch"
          },
          {
            "name": "Surveys & interviews"
          }
        ]
      },
      {
        "title": "Analytics & Measurement",
        "tools": [
          {
            "name": "Google Analytics 4"
          },
          {
            "name": "Google Search Console"
          },
          {
            "name": "Looker Studio"
          },
          {
            "name": "Microsoft Clarity"
          }
        ]
      },
      {
        "title": "Planning & Collaboration",
        "tools": [
          {
            "name": "Figma"
          },
          {
            "name": "FigJam"
          },
          {
            "name": "Notion"
          },
          {
            "name": "Miro"
          }
        ]
      },
      {
        "title": "MarTech",
        "tools": [
          {
            "name": "CRM platforms"
          },
          {
            "name": "Marketing automation"
          },
          {
            "name": "Tag management"
          },
          {
            "name": "CDP readiness"
          }
        ]
      }
    ]
  },
  "why": {
    "heading": "Why Brands Choose Webmaffia for Digital Strategy",
    "items": [
      "Strategy is delivered by the same team that executes it, across website, SEO, social, content, apps and influencers, so plans don't stall in handoffs.",
      "Offices in Mumbai, Bengaluru and Dubai, with strategy work across pharma, real estate, infrastructure, energy, D2C and financial services.",
      "AI search visibility is part of every strategy, not a separate project added later.",
      "Clear KPIs and dashboards from day one, so you can see what the plan is delivering."
    ]
  },
  "process": {
    "heading": "Our Digital Strategy Process",
    "items": [
      {
        "title": "Discover & Audit",
        "text": "Stakeholder interviews, digital audit and competitor benchmarks."
      },
      {
        "title": "Research & Insight",
        "text": "Audience, journey and search and AI demand research."
      },
      {
        "title": "Strategy & Positioning",
        "text": "Positioning, messaging, channel mix and budget plan."
      },
      {
        "title": "Roadmap & KPIs",
        "text": "Prioritised roadmap, MarTech plan, KPIs and dashboards."
      },
      {
        "title": "Activate & Review",
        "text": "Handover or execution by our team, with regular reviews and updates."
      }
    ]
  },
  "blogCategories": [
    "Digital Strategy"
  ],
  "faqHeading": "Frequently asked questions",
  "faqs": [
    {
      "question": "What does a digital strategy agency do?",
      "answer": "A digital strategy agency researches your market, customers and competitors, defines your positioning, chooses the right channels and budget split, plans your technology, and sets KPIs to measure success. Webmaffia can also execute the plan across all eight of our services."
    },
    {
      "question": "What is included in a digital marketing strategy?",
      "answer": "Usually a digital audit, audience research and customer journeys, positioning and messaging, a channel and budget plan, content and search priorities, a technology roadmap and a measurement framework with KPIs."
    },
    {
      "question": "How long does it take to build a digital strategy?",
      "answer": "It depends on the size of the business, number of markets and how much research is needed. We agree a timeline and milestones after an initial discovery call."
    },
    {
      "question": "How is digital strategy different from digital marketing?",
      "answer": "Digital strategy decides where you are going and why: goals, audiences, positioning, channels and measurement. Digital marketing is the execution: the campaigns, content, websites and ads that deliver the plan."
    },
    {
      "question": "Does your strategy cover AI search and AI Overviews?",
      "answer": "Yes. We plan how your brand appears in Google AI Overviews, ChatGPT, Gemini and Perplexity through answer-first content, structured data, AI crawler access and authority building. No one can guarantee a citation, but the strategy makes it far more likely."
    },
    {
      "question": "How much do digital strategy services cost?",
      "answer": "It depends on scope, number of business units and markets, and depth of research. We share a custom proposal after understanding your goals."
    }
  ],
  "otherServices": [
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
    },
    {
      "title": "Influencer Marketing",
      "href": "/services/influencer-marketing"
    }
  ]
};

export default buildStaticService(raw);

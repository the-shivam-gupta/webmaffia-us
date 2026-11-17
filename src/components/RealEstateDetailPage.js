import Link from "next/link";
import Image from "next/image";
import JsonLd from "@/components/JsonLd";
import ServiceFaqAccordion from "@/components/ServiceFaqAccordion";
import { buildBreadcrumbSchema, buildFaqSchema, SITE_URL } from "@/lib/schema";

const PAGE_PATH = "/services/real-estate-website-design-development";

const BREADCRUMBS = [
  { name: "Home", path: "/" },
  { name: "Services", path: "/services" },
  { name: "Real estate website design", path: PAGE_PATH },
];

const SERVICE_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "Real estate website design and development",
  serviceType:
    "Website design and development for real estate developers, builders and brokers",
  provider: { "@type": "Organization", name: "Webmaffia", url: `${SITE_URL}/` },
  areaServed: ["India", "United Arab Emirates"],
  url: `${SITE_URL}${PAGE_PATH}`,
  description:
    "Real estate websites with project pages, property search, lead capture and CRM integration.",
};

const STATS = [
  { value: "100+", label: "Real estate websites delivered" },
  { value: "5+ years", label: "Average client partnership" },
  { value: "High", label: "Performance & SEO focused" },
  { value: "100%", label: "Client satisfaction" },
];

const PROBLEMS = [
  { title: "Low quality leads", text: "We design websites with clear calls-to-action, better content structure and optimized UX to attract the right audience." },
  { title: "Unclear property information", text: "We organize listings with detailed information, intuitive filters and high-quality visuals for easy decision-making." },
  { title: "Poor mobile experience", text: "We build fully responsive websites that look and perform flawlessly on every device." },
  { title: "Lack of trust & credibility", text: "We include testimonials, project details, certifications and professional design to build confidence." },
  { title: "Limited online visibility", text: "We follow SEO best practices to help your website rank higher and get discovered by more potential buyers." },
];

const ICONS = {
  design: <><rect x="3" y="4" width="18" height="12" rx="1.5" /><path d="M8 20h8M12 16v4" /></>,
  code: <path d="m8 7-5 5 5 5M16 7l5 5-5 5M14 4l-4 16" />,
  db: <><ellipse cx="12" cy="5.5" rx="7" ry="2.5" /><path d="M5 5.5v13c0 1.4 3.1 2.5 7 2.5s7-1.1 7-2.5v-13M5 12c0 1.4 3.1 2.5 7 2.5s7-1.1 7-2.5" /></>,
  shield: <path d="M12 3 4.5 6v5.5c0 4.6 3.1 8 7.5 9.5 4.4-1.5 7.5-4.9 7.5-9.5V6L12 3Z" />,
  home: <path d="m3 11 9-7 9 7v9H3zM9 20v-6h6v6" />,
  sell: <><rect x="4" y="4" width="16" height="16" rx="2" /><path d="M4 10h16M10 10v10" /></>,
  speed: <path d="M4 18a8 8 0 1 1 16 0M12 18l4-6" />,
  user: <><circle cx="12" cy="8" r="4" /><path d="M4 21c0-4.4 3.6-7 8-7s8 2.6 8 7" /></>,
};

function Icon({ name }) {
  return (
    <svg
      className="re_icon"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {ICONS[name]}
    </svg>
  );
}

function Check() {
  return (
    <svg
      className="re_tick"
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="m3.5 8.5 3 3 6-7" />
    </svg>
  );
}

const SERVICES = [
  { icon: "design", title: "Website Design", text: "Modern, elegant and user-friendly designs that reflect your brand and properties.", points: ["Custom UI/UX Design", "Brand-aligned Visuals", "Mobile-First Approach"] },
  { icon: "code", title: "Development", text: "Fast, secure and scalable websites built for performance and growth.", points: ["Next.js / React Development", "CMS Integration (Strapi / WordPress)", "SEO & Performance Optimization"] },
  { icon: "db", title: "Ongoing Support", text: "We keep your website updated, secure and running at its best.", points: ["Content Updates", "Technical Support", "Performance Monitoring"] },
];

const SITE_TYPES = ["Property Listing Website", "Project Landing Page", "Real Estate Portal"];
const FEATURES = [
  { name: "Property Listings", has: [1, 1, 1] },
  { name: "Advanced Filters", has: [1, 1, 1] },
  { name: "Virtual Tours / 360°", has: [0, 1, 1] },
  { name: "Lead Management", has: [1, 1, 1] },
  { name: "Multi-Location Support", has: [0, 0, 1] },
  { name: "Custom Integrations", has: [1, 1, 1] },
];

const STEPS = [
  { title: "Discover & Plan", text: "We understand your goals, audience and brand to create a clear strategy." },
  { title: "Design & Develop", text: "We design a compelling UI and build a high-performing, secure website." },
  { title: "Launch & Grow", text: "We go live, then support, optimize and help you get more traffic and leads." },
];

const RECEIVE = [
  "Custom website design & development",
  "Mobile & cross-browser compatibility",
  "Technical documentation",
  "CMS setup (easy content management)",
  "Property listing setup & admin training",
  "Ongoing support & maintenance",
  "SEO optimization",
  "Analytics & performance tracking",
  "Post-launch growth recommendations",
];

const SECURITY = [
  "SSL encryption (HTTPS)",
  "Secure hosting & backups",
  "GDPR compliant practices",
  "Regular security updates",
];

const WHY = [
  { icon: "home", title: "Real Estate Expertise", text: "We understand the market, the audience and what works." },
  { icon: "sell", title: "Design That Sells", text: "Clean, modern and conversion-focused designs." },
  { icon: "speed", title: "Performance Driven", text: "Faster sites, better rankings, more leads." },
  { icon: "user", title: "Personal Support", text: "A dedicated team that cares about your success." },
];

const RESULTS = [
  { value: "60%", label: "Average increase in site visits" },
  { value: "3x", label: "More qualified inquiries" },
  { value: "40%", label: "Higher engagement rate" },
  { value: "95%", label: "Client retention rate" },
];

const FAQS = [
  { question: "How long does it take to build a real estate website?", answer: "It depends on scope. A single-project microsite is quicker than a multi-project developer website with listings and CRM integration. We give a realistic timeline after discovery." },
  { question: "Can you integrate with my existing CRM?", answer: "Often, yes. Enquiries can be passed to your CRM or sales tool so no lead sits in an inbox. This depends on the integration options your CRM offers, and we check it during discovery." },
  { question: "Will I be able to update the content myself?", answer: "Yes. We set up a CMS so your team can update listings and content, and we train your team to use it." },
  { question: "Do you offer ongoing support after launch?", answer: "Yes. We offer content updates, technical support and performance monitoring after launch." },
  { question: "Do you provide SEO as part of the service?", answer: "We build a clean structure, fast pages, schema and analytics from launch, and can plan ongoing SEO alongside the website." },
  { question: "What platforms do you work with?", answer: "We build with Next.js and React, and integrate CMS platforms such as Strapi and WordPress, depending on what suits your project." },
];

const FAQ_SCHEMA_ITEMS = FAQS.map((item, index) => ({
  id: `re-faq-${index}`,
  question: item.question,
  answer: `<p>${item.answer}</p>`,
}));

const pad = (n) => String(n + 1).padStart(2, "0");

function Label({ children }) {
  return <div className="re_label">{children}</div>;
}

export default function RealEstateDetailPage() {
  return (
    <main className="wrapper">
      <JsonLd data={buildBreadcrumbSchema(BREADCRUMBS)} />
      <JsonLd data={SERVICE_SCHEMA} />
      <JsonLd data={buildFaqSchema(FAQ_SCHEMA_ITEMS)} />

      <div className="ml-setter service_detail">
        <div className="re_page">
          {/* Hero */}
          <section className="re_hero" aria-labelledby="re-h1">
            <div className="re_hero_copy">
              <Label>Real estate website design &amp; development</Label>
              <h1 id="re-h1">Real estate websites that drive site visits</h1>
              <p>
                We build fast, modern and high-performing real estate websites
                that showcase properties, build trust and turn interest into
                inquiries — helping you get more site visits and qualified
                leads.
              </p>
              <div className="re_btns">
                <Link href="#contact" className="re_btn re_btn_dark">
                  Start a Project <span aria-hidden="true">→</span>
                </Link>
                <Link href="/case-study" className="re_btn re_btn_line">
                  View Our Work
                </Link>
              </div>
            </div>
            <figure className="re_hero_img">
              <Image
                src="/assets/images/real-estate/modern-villa.png"
                alt="Modern villa with large glass windows"
                width={1672}
                height={941}
                priority
                sizes="(max-width: 1024px) 100vw, 45vw"
              />
            </figure>
          </section>

          <div className="re_stats" role="list">
            {STATS.map((item) => (
              <div className="re_stat" role="listitem" key={item.label}>
                <b>{item.value}</b>
                <span>{item.label}</span>
              </div>
            ))}
          </div>

          {/* Approach */}
          <section className="re_approach" aria-labelledby="approach-h">
            <Image
              src="/assets/images/real-estate/laptop-scenary.png"
              alt="Real estate website shown on a laptop"
              width={1408}
              height={768}
              sizes="(max-width: 1024px) 100vw, 45vw"
            />
            <div>
              <Label>Our approach</Label>
              <h2 id="approach-h">
                More than just a website. A powerful sales tool.
              </h2>
              <p>
                We create real estate websites that do more than look good.
                They help you showcase your properties, highlight key
                features, build credibility and guide visitors towards taking
                the next step — be it an inquiry, a site visit or a purchase.
              </p>
            </div>
          </section>

          {/* Problems */}
          <section className="re_block" aria-labelledby="problems-h">
            <Label>The problems we solve</Label>
            <h2 id="problems-h">
              Real estate businesses face unique digital challenges. We solve
              them.
            </h2>
            <ul className="re_rows">
              {PROBLEMS.map((item, i) => (
                <li key={item.title}>
                  <span className="re_n">{pad(i)}</span>
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                </li>
              ))}
            </ul>
          </section>

          {/* Services */}
          <section className="re_block" aria-labelledby="services-h">
            <Label>Our services</Label>
            <h2 id="services-h">End-to-end real estate website solutions</h2>
            <div className="re_cols re_cols3">
              {SERVICES.map((item) => (
                <article key={item.title}>
                  <Icon name={item.icon} />
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                  <ul>
                    {item.points.map((pt) => (
                      <li key={pt}>
                        <Check />
                        {pt}
                      </li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
          </section>

          {/* Types & features */}
          <section className="re_block" aria-labelledby="types-h">
            <Label>Website types &amp; features</Label>
            <h2 id="types-h">Tailored for every real estate need</h2>
            <div className="re_table_wrap">
              <table className="re_table">
                <thead>
                  <tr>
                    <th scope="col">Feature</th>
                    {SITE_TYPES.map((t) => (
                      <th scope="col" key={t}>
                        {t}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {FEATURES.map((row) => (
                    <tr key={row.name}>
                      <th scope="row">{row.name}</th>
                      {row.has.map((v, i) => (
                        <td key={SITE_TYPES[i]} data-label={SITE_TYPES[i]}>
                          {v ? (
                            <>
                              <Check />
                              <span className="re_sr">Included</span>
                            </>
                          ) : (
                            <>
                              <span aria-hidden="true">—</span>
                              <span className="re_sr">Not included</span>
                            </>
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Process */}
          <section className="re_block" aria-labelledby="process-h">
            <Label>Our process</Label>
            <h2 id="process-h">A Simple 3-Step Process</h2>
            <ol className="re_steps">
              {STEPS.map((item, i) => (
                <li key={item.title}>
                  <span className="re_step_n">{pad(i)}</span>
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                </li>
              ))}
            </ol>
          </section>

          {/* Receive */}
          <section className="re_block" aria-labelledby="receive-h">
            <Label>What you receive</Label>
            <h2 id="receive-h">Everything you need for a successful launch</h2>
            <ul className="re_checks">
              {RECEIVE.map((t) => (
                <li key={t}>
                  <Check />
                  {t}
                </li>
              ))}
            </ul>
          </section>

          {/* Security */}
          <section className="re_security" aria-labelledby="security-h">
            <Icon name="shield" />
            <div>
              <Label>Security &amp; compliance</Label>
              <h2 id="security-h">Built for trust. Secured for the long run.</h2>
              <p>
                We follow the latest security standards and best practices to
                keep your data, your customers and your brand safe.
              </p>
            </div>
            <ul className="re_checks re_checks_1">
              {SECURITY.map((t) => (
                <li key={t}>
                  <Check />
                  {t}
                </li>
              ))}
            </ul>
          </section>

          {/* Why */}
          <section className="re_block" aria-labelledby="why-h">
            <Label>Why Webmaffia</Label>
            <h2 id="why-h">Why real estate brands choose Webmaffia</h2>
            <div className="re_cols re_cols4">
              {WHY.map((item) => (
                <article key={item.title}>
                  <Icon name={item.icon} />
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                </article>
              ))}
            </div>
          </section>

          {/* Results */}
          <section className="re_block" aria-labelledby="results-h">
            <Label>Real results</Label>
            <h2 id="results-h">Real Numbers. Real Impact.</h2>
            <div className="re_cols re_cols4 re_results">
              {RESULTS.map((item) => (
                <div key={item.label}>
                  <b>{item.value}</b>
                  <span>{item.label}</span>
                </div>
              ))}
            </div>
          </section>

          {/* FAQ */}
          <section id="faq" className="re_block">
            <Label>Frequently asked questions</Label>
            <ServiceFaqAccordion heading="Got questions? We’ve got answers." items={FAQ_SCHEMA_ITEMS} />
          </section>

          {/* CTA */}
          <section id="contact" className="re_final" aria-labelledby="contact-h">
            <div>
              <Label>Let’s build something great</Label>
              <h2 id="contact-h">
                Ready to create a real estate website that brings in more site
                visits?
              </h2>
            </div>
            <div className="re_final_cta">
              <Link href="/contact" className="re_btn re_btn_dark">
                Get in Touch <span aria-hidden="true">→</span>
              </Link>
              <span>Talk to our team about your project</span>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}

import Banner from "@/components/Banner";
import JsonLd from "@/components/JsonLd";
import StatisticsBar from "@/components/StatisticsBar";
import TeamFaq from "@/components/TeamFaq";
import { LogoGridSection, SectionHead } from "@/components/HomePage";
import { getFooter, getHome } from "@/lib/strapiPage";
import { buildOfficeLocations, buildSections } from "@/lib/homeSections";
import { buildBreadcrumbSchema } from "@/lib/schema";
import {
  TEAM_FAQS,
  TEAM_LEADERS,
  TEAM_MEMBERS,
  TEAM_POD,
} from "@/lib/team";

const BREADCRUMB_SCHEMA = buildBreadcrumbSchema([
  { name: "Home", path: "/" },
  { name: "Team", path: "/team" },
]);

export const metadata = {
  title: "Meet the Webmaffia Team - Strategists, Designers & Developers",
  description:
    "Meet the 30 strategists, designers, developers and SEO specialists behind Webmaffia, co-founded by Veera Ghuara Roy and working from Mumbai, Bengaluru and Dubai.",
  alternates: {
    canonical: "https://www.webmaffia.com/team",
  },
};

// Banner artwork is the testimonial illustration; the copy is the team page's own.
function buildTeamBannerData() {
  return {
    imagePosition: "right",
    priority: true,
    subheading: { enabled: true, text: "TEAM" },
    title: { line1: "Meet", line2: "the maffians" },
    description:
      "Webmaffia is a team of 30 strategists, designers, developers, SEO specialists and writers who build websites and run digital marketing for enterprise brands. Co-founded by Veera Ghuara Roy, we work from Mumbai, Bengaluru and Dubai.",
    images: {
      banner: {
        url: "/assets/images/testimonial_img.webp",
        alt: "Webmaffia team",
        width: 678,
        height: 877,
      },
    },
  };
}

function TeamMember({ role, name }) {
  return (
    <div className="team_member">
      <div className="team_photo" />
      <div className="team_role">{role}</div>
      <div className="team_name">{name}</div>
    </div>
  );
}

export default async function TeamPage() {
  const [home, footer] = await Promise.all([getHome(), getFooter()]);
  const sections = buildSections(home?.sections);
  const statistics = sections.find((section) => section.type === "statistics");
  const trophies = sections.find((section) => section.type === "trophies");

  return (
    <main className="wrapper home_wrapper team_page">
      <JsonLd data={BREADCRUMB_SCHEMA} />
      <div className="ml-setter">
        <Banner data={buildTeamBannerData()} />

        {statistics ? (
          <StatisticsBar
            locations={buildOfficeLocations(footer?.offices)}
            stats={statistics.stats}
          />
        ) : null}

        <section data-section="team" className="team_section">
          <SectionHead tagline="Team" title={"The people who\nrun the family"} />
          <div className="team_grid">
            {[...TEAM_LEADERS, ...TEAM_MEMBERS].map((member) => (
              <TeamMember key={member.name} {...member} />
            ))}
          </div>
        </section>

        <section data-section="pod" className="team_pod">
          <div className="team_pod_head">
            <SectionHead
              tagline="How we work with you"
              title="Who will work on my project?"
            />
            <p className="section_description">
              Every client gets a dedicated pod of six specialists, led by one
              account lead who is your single point of contact.
            </p>
          </div>
          <ol className="team_pod_list">
            {TEAM_POD.map((item, index) => (
              <li className="team_pod_item" key={item.title}>
                <span className="team_pod_number">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div>
                  <h3 className="team_pod_title">{item.title}</h3>
                  <p>{item.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        {trophies ? <LogoGridSection section={trophies} /> : null}

        <section data-section="life" className="team_life">
          <SectionHead
            tagline="Life at Webmaffia"
            title={"Serious about the work.\nNot about ourselves."}
          />
          {/* Blank placeholders until the office photos are ready. */}
          <div className="team_life_grid">
            <div className="team_life_photo team_life_photo--large" />
            <div className="team_life_photo" />
            <div className="team_life_photo" />
            <div className="team_life_photo" />
            <div className="team_life_photo" />
          </div>
        </section>

        <section data-section="faq" className="team_faq">
          <div className="team_faq_head">
            <h2 className="sub_title">FAQ</h2>
            <div className="sub_heading">About the Webmaffia team</div>
          </div>
          <TeamFaq items={TEAM_FAQS} />
        </section>
      </div>
    </main>
  );
}

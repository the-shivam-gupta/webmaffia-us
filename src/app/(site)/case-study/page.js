import Banner from "@/components/Banner";
import JsonLd from "@/components/JsonLd";
import WorkListSection from "@/components/WorkListSection";
import { getCaseStudyThumbnails } from "@/lib/strapiPage";
import { buildBreadcrumbSchema } from "@/lib/schema";
import { toCaseStudyItem } from "@/lib/case-study-helpers";

const BREADCRUMB_SCHEMA = buildBreadcrumbSchema([
  { name: "Home", path: "/" },
  { name: "Our Work", path: "/case-study" },
]);

export const metadata = {
  alternates: {
    canonical: "https://www.webmaffia.com/case-study",
  },
  title: "Project Portfolio and Successfull Campaigns by Webmaffia",
  description:
    "Discover Webmaffia's diverse project portfolio showcasing innovative, successful campaigns across industries. See how we drive results for our clients.",
};

const bannerData = {
  imagePosition: "right",
  subheading: {
    enabled: true,
    text: "STORIES WE TELL",
  },
  title: {
    line1: "Explore our",
    line2: "latest work",
  },
  description:
    "Here are some of the client collaborations we're\nmost proud of. Leveraging cutting-edge\ntechnologies, we drive innovation in our projects,\ndelivering solutions that exceed expectations.\nGet inspired.",
  images: {
    banner: {
      url: "/assets/images/case-study.svg",
      alt: "",
      width: 672,
      height: 566,
    },
  },
};

export default async function CaseStudyPage() {
  let items = [];
  try {
    const caseStudies = await getCaseStudyThumbnails();

    items = caseStudies
      .map((entry) => ({
        item: toCaseStudyItem(entry),
        external: !!entry.thumbnail?.externalLink,
        name: (entry.thumbnail?.heading ?? entry.pageName).toLowerCase(),
      }))
      .sort((a, b) => {
        if (a.name === "lupin") return -1;
        if (b.name === "lupin") return 1;
        return Number(a.external) - Number(b.external);
      })
      .map(({ item }) => item);
  } catch (e) {
    console.error("Failed to fetch case studies:", e);
  }

  return (
    <main className="wrapper">
      <JsonLd data={BREADCRUMB_SCHEMA} />
      <div className="ml-setter work_list">
        <Banner data={bannerData} />
        <WorkListSection items={items} />
      </div>
    </main>
  );
}

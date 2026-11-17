import { notFound, redirect, permanentRedirect } from "next/navigation";
import CampaignDetail from "@/app/(site)/case-study/campaigns/CampaignDetail";
import CaseStudyDetailPage from "@/components/CaseStudyDetailPage";
import JsonLd from "@/components/JsonLd";
import { normalizeCaseStudy } from "@/lib/case-study-helpers";
import { buildBreadcrumbSchema } from "@/lib/schema";
import {
  getCampaignBySlug,
  getCampaigns,
  getCaseStudies,
  getCaseStudyBySlug,
  getSeoFields,
} from "@/lib/strapiPage";

export async function generateStaticParams() {
  const [caseStudies, campaigns] = await Promise.all([
    getCaseStudies(),
    getCampaigns().catch((error) => {
      console.error("Failed to fetch campaigns:", error);
      return [];
    }),
  ]);

  const caseStudySlugs = new Set(
    caseStudies
      .filter((entry) => !entry.thumbnail?.externalLink)
      .map((entry) => entry.slug)
  );

  const params = [...caseStudySlugs].map((slug) => ({ slug }));

  for (const campaign of campaigns) {
    if (!caseStudySlugs.has(campaign.slug)) {
      params.push({ slug: campaign.slug });
    }
  }

  return params;
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const entry = await getCaseStudyBySlug(slug);

  if (entry) {
    if (entry.thumbnail?.externalLink) {
      return { title: `${entry.pageName ?? "Case Study"} | Webmaffia` };
    }

    const title =
      entry.banner?.heading?.replace(/\n/g, " ") ??
      entry.pageName ??
      "Case Study";
    const description = entry.banner?.description?.replace(/\s+/g, " ").trim();

    return {
      title: `${title} | Webmaffia`,
      description,
      alternates: {
        canonical: `https://www.webmaffia.com/case-study/${entry.slug}`,
      },
    };
  }

  const campaign = await getCampaignBySlug(slug);

  if (!campaign) {
    return { title: "Case Study | Webmaffia" };
  }

  const seo = getSeoFields(campaign.seo);

  return {
    title: seo.title ?? `${campaign.pageName ?? campaign.heading} | Webmaffia`,
    description: seo.description ?? campaign.tagLine,
    ...(seo.keywords ? { keywords: seo.keywords } : {}),
    alternates: {
      canonical:
        seo.canonical ?? `https://www.webmaffia.com/case-study/${campaign.slug}`,
    },
  };
}

export default async function CaseStudySlugPage({ params }) {
  const { slug } = await params;
  const entry = await getCaseStudyBySlug(slug);

  if (entry) {
    if (entry.thumbnail?.externalLink) {
      redirect(entry.thumbnail.link || "/case-study");
    }

    if (entry.slug !== slug) {
      permanentRedirect(`/case-study/${entry.slug}`);
    }

    const caseStudy = normalizeCaseStudy(entry);
    const breadcrumbTitle =
      entry.banner?.heading?.replace(/\n/g, " ") ?? entry.pageName ?? entry.slug;
    const breadcrumbSchema = buildBreadcrumbSchema([
      { name: "Home", path: "/" },
      { name: "Our Work", path: "/case-study" },
      { name: breadcrumbTitle, path: `/case-study/${entry.slug}` },
    ]);

    return (
      <>
        <JsonLd data={breadcrumbSchema} />
        <CaseStudyDetailPage caseStudy={caseStudy} />
      </>
    );
  }

  const campaign = await getCampaignBySlug(slug);

  if (!campaign) {
    notFound();
  }

  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: "Home", path: "/" },
    { name: "Our Work", path: "/case-study" },
    { name: campaign.pageName ?? campaign.heading ?? campaign.slug, path: `/case-study/${campaign.slug}` },
  ]);

  return (
    <>
      <JsonLd data={breadcrumbSchema} />
      <CampaignDetail campaign={campaign} />
    </>
  );
}

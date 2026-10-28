import HomePage from "@/components/HomePage";
import JsonLd from "@/components/JsonLd";
import { getBlog, getFooter, getHome, getTestimonials } from "@/lib/strapiPage";
import {
  buildHomeBannerData,
  buildOfficeLocations,
  buildSections,
  mapBlogCard,
} from "@/lib/homeSections";
import { ORGANIZATION_SCHEMA, LOCAL_BUSINESS_SCHEMA } from "@/lib/schema";

export const metadata = {
  alternates: {
    canonical: "https://www.webmaffia.com/",
  },
};

export default async function Home() {
  const [testimonials, home, footer, blogs] = await Promise.all([
    getTestimonials(),
    getHome(),
    getFooter(),
    getBlog(),
  ]);
  const bannerData = buildHomeBannerData(home?.banner);
  const sections = buildSections(home?.sections);
  const locations = buildOfficeLocations(footer?.offices);
  // getBlog() is already sorted newest-first.
  const latestBlogs = blogs.slice(0, 3).map(mapBlogCard);

  return (
    <>
      <JsonLd data={ORGANIZATION_SCHEMA} />
      <JsonLd data={LOCAL_BUSINESS_SCHEMA} />
      <HomePage
        bannerData={bannerData}
        sections={sections}
        testimonials={testimonials}
        blogs={latestBlogs}
        locations={locations}
      />
    </>
  );
}

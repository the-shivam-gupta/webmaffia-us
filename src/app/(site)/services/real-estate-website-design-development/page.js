import RealEstateDetailPage from "@/components/RealEstateDetailPage";
import { SITE_URL } from "@/lib/schema";

// Static route: takes precedence over the CMS-driven /services/[slug] page.
const TITLE = "Real Estate Website Design & Development | Webmaffia";
const DESCRIPTION =
  "Webmaffia designs and builds real estate websites with project pages, property search, lead capture and CRM integration for builders and brokers in India.";
const URL = `${SITE_URL}/services/real-estate-website-design-development`;

export const metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: URL },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: URL,
    type: "website",
  },
};

export default function RealEstateWebsiteDesignPage() {
  return <RealEstateDetailPage />;
}

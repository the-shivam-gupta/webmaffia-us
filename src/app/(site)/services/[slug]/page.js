import { notFound } from "next/navigation";
import ServiceDetailPage from "@/components/ServiceDetailPage";
import {
  buildServiceLocationMetadata,
  formatCityDisplayName,
  getAllServiceEntries,
  getAllServiceLocationPaths,
  getServiceEntryBySlug,
  getServiceLocationMatch,
  SITE_URL,
  withCityInHeading,
} from "@/lib/serviceLocations";
import { getServiceRenderConfig } from "@/lib/serviceContent";

/**
 * Handles two URL shapes under the single `[slug]` dynamic segment (Next.js
 * requires sibling dynamic routes at the same path level to share a param
 * name, so both live here rather than as separate `[slug]` /
 * `[serviceLocation]` routes):
 *   - /services/<service-slug>                e.g. /services/digital-strategy
 *   - /services/<service-slug>-in-<city-slug> e.g. /services/digital-strategy-in-andheri
 */
export async function generateStaticParams() {
  const [services, locationPaths] = await Promise.all([
    getAllServiceEntries(),
    getAllServiceLocationPaths(),
  ]);

  return [
    ...services.map((service) => ({ slug: service.slug })),
    ...locationPaths.map(({ serviceLocation }) => ({ slug: serviceLocation })),
  ];
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const service = await getServiceEntryBySlug(slug);

  if (service) {
    return {
      title: service.metadata?.title,
      description: service.metadata?.description,
      alternates: {
        canonical: `${SITE_URL}/services/${slug}`,
      },
    };
  }

  const match = await getServiceLocationMatch(slug);
  if (!match) {
    return { title: "Service | Webmaffia" };
  }

  return buildServiceLocationMetadata(
    match.service,
    match.city,
    `services/${slug}`
  );
}

export default async function ServiceSlugPage({ params }) {
  const { slug } = await params;
  const service = await getServiceEntryBySlug(slug);

  if (service) {
    const config = {
      ...(await getServiceRenderConfig(slug)),
      workCategories: service.workCategories,
    };
    const breadcrumbs = [
      { name: "Home", path: "/" },
      { name: "Services", path: "/services" },
      { name: service.headingTitle, path: `/services/${slug}` },
    ];

    return <ServiceDetailPage config={config} breadcrumbs={breadcrumbs} />;
  }

  const match = await getServiceLocationMatch(slug);
  if (!match) {
    notFound();
  }

  const baseConfig = {
    ...(await getServiceRenderConfig(match.service.slug)),
    workCategories: match.service.workCategories,
  };
  const config = withCityInHeading(
    baseConfig,
    match.service.headingTitle,
    match.city.name
  );

  const cityLabel = formatCityDisplayName(match.city.name);
  const breadcrumbs = [
    { name: "Home", path: "/" },
    { name: "Services", path: "/services" },
    { name: match.service.headingTitle, path: `/services/${match.service.slug}` },
    {
      name: `${match.service.headingTitle} in ${cityLabel}`,
      path: `/services/${slug}`,
    },
  ];

  return <ServiceDetailPage config={config} breadcrumbs={breadcrumbs} />;
}

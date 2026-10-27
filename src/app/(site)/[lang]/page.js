import { notFound, permanentRedirect } from "next/navigation";
import {
  getAllServiceLocationPaths,
  getServiceLocationMatch,
} from "@/lib/serviceLocations";

/**
 * City-variant service pages (e.g. /digital-strategy-in-andheri) moved under
 * /services/ (e.g. /services/digital-strategy-in-andheri) to match the base
 * service pages living at /services/<slug>. This route is kept only as a
 * permanent redirect so old indexed/shared links keep working.
 *
 * The dynamic segment is named `lang` (not `serviceLocation`) because Next
 * requires sibling dynamic segments at the same level to share a name, and the
 * blog/author section lives under app/[lang]. Here the value is a service
 * location slug, never a locale.
 */
export async function generateStaticParams() {
  const paths = await getAllServiceLocationPaths();
  return paths.map(({ serviceLocation }) => ({ lang: serviceLocation }));
}

export default async function LegacyServiceLocationRedirect({ params }) {
  const { lang: serviceLocation } = await params;
  const match = await getServiceLocationMatch(serviceLocation);

  if (!match) {
    notFound();
  }

  permanentRedirect(`/services/${serviceLocation}`);
}

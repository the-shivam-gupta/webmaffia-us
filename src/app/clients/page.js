import Banner from "@/components/Banner";
import ClientsLogosGrid from "@/components/ClientsLogosGrid";
import JsonLd from "@/components/JsonLd";
import { buildBannerCta, getClientBanner, getClients, getStrapiImageUrl } from "@/lib/strapiPage";
import { buildBreadcrumbSchema } from "@/lib/schema";

export const metadata = {
  alternates: {
    canonical: "https://www.webmaffia.com/clients",
  },
};

const BREADCRUMB_SCHEMA = buildBreadcrumbSchema([
  { name: "Home", path: "/" },
  { name: "Our Client", path: "/clients" },
]);

function splitParagraphs(text) {
  if (!text) return [];
  return text
    .split("\n\n")
    .filter(Boolean)
    .map((p) => p.trim());
}

function buildClientsBannerData(rawBanner) {
  if (!rawBanner) return null;

  const subHeading = rawBanner.subHeading || "";
  const lastSpace = subHeading.lastIndexOf(" ");

  const paragraphs = splitParagraphs(rawBanner.description);

  let images;
  if (rawBanner.desktopImage?.url) {
    images = {
      banner: {
        url: getStrapiImageUrl(rawBanner.desktopImage),
        alt: rawBanner.desktopImage.alternativeText || "",
        width: rawBanner.desktopImage.width || 871,
        height: rawBanner.desktopImage.height || 767,
      },
    };
    if (rawBanner.mobileImage?.url) {
      images.bannerMobile = {
        url: getStrapiImageUrl(rawBanner.mobileImage),
        alt: rawBanner.mobileImage.alternativeText || "",
      };
    }
  }

  return {
    imagePosition: rawBanner.imagePosition || "right",
    subheading: rawBanner.heading
      ? { enabled: true, text: rawBanner.heading.trim() }
      : undefined,
    title: {
      line1: lastSpace > 0 ? subHeading.slice(0, lastSpace) : subHeading,
      ...(lastSpace > 0 ? { line2: subHeading.slice(lastSpace + 1) } : {}),
    },
    descriptions: paragraphs.length ? paragraphs : undefined,
    cta: buildBannerCta(rawBanner),
    ...(images ? { images } : {}),
  };
}

export default async function Clients() {
  const [clients, clientBannerData] = await Promise.all([
    getClients(),
    getClientBanner(),
  ]);

  const bannerData = clientBannerData?.banner
    ? buildClientsBannerData(clientBannerData.banner)
    : null;

  const clientLogos = (clients ?? [])
    .filter((client) => client.logo?.url)
    .map((client) => ({
      id: client.documentId,
      src: getStrapiImageUrl(client.logo),
      alt: client.name || "",
      width: client.logo?.width || 317,
      height: client.logo?.height || 122,
    }));

  return (
    <main className="wrapper clients_wrapper">
      <JsonLd data={BREADCRUMB_SCHEMA} />
      <div className="ml-setter clients_page">
        {bannerData && (
          <Banner
            data={bannerData}
            dataSection="clients_hero"
            className="hero_section banner_para flex"
          />
        )}

        <ClientsLogosGrid logos={clientLogos} />
      </div>
    </main>
  );
}

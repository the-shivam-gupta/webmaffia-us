import { buildBannerCta, getCareer, getStrapiImageUrl } from "@/lib/strapiPage";

export async function GET() {
  try {
    const data = await getCareer();
    if (!data) return Response.json(null);

    const result = { slug: data.slug };

    if (data.banner) {
      const b = data.banner;
      const subHeading = b.subHeading || "";
      const lastSpace = subHeading.lastIndexOf(" ");
      const images = {};

      if (b.desktopImage?.url) {
        images.banner = {
          url: getStrapiImageUrl(b.desktopImage),
          alt: b.desktopImage.alternativeText || "",
          width: b.desktopImage.width || 871,
          height: b.desktopImage.height || 767,
        };
      }
      if (b.mobileImage?.url) {
        images.bannerMobile = {
          url: getStrapiImageUrl(b.mobileImage),
          alt: b.mobileImage.alternativeText || "",
        };
      }

      result.banner = {
        imagePosition: b.imagePosition || "right",
        subheading: b.heading
          ? { enabled: true, text: b.heading }
          : undefined,
        title: {
          line1: lastSpace > 0 ? subHeading.slice(0, lastSpace) : subHeading,
          ...(lastSpace > 0 ? { line2: subHeading.slice(lastSpace + 1) } : {}),
        },
        description: (b.description || "").trim(),
        cta: buildBannerCta(b),
        ...(Object.keys(images).length ? { images } : {}),
      };
    }

    if (data.career) {
      result.career = {
        heading: data.career.heading,
        accordion: (data.career.accordion || []).map((item) => ({
          id: item.id,
          jobTitle: item.jobTitle,
          description: item.description || "",
        })),
      };
    }

    return Response.json(result);
  } catch (error) {
    console.error("Failed to fetch career data:", error);
    return Response.json(null, { status: 500 });
  }
}

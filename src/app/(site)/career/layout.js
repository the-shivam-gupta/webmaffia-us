import { getCareer } from "@/lib/strapiPage";

export async function generateMetadata() {
  const data = await getCareer();
  const slug = data?.slug || "career";
  return {
    title: "Career in Digital Marketing Agency - Webmaffia",
    description:
      "Work with the best digital marketing agency of talented people who love digital. Connect with us for a career in digital marketing.",
    alternates: {
      canonical: `https://www.webmaffia.com/${slug}`,
    },
  };
}

export default function CareerLayout({ children }) {
  return children;
}

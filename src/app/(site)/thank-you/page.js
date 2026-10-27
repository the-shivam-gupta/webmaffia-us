import Image from "next/image";
import Link from "next/link";
import JsonLd from "@/components/JsonLd";
import { buildBreadcrumbSchema } from "@/lib/schema";

export const metadata = {
  title: "Thank You | Webmaffia",
};

const BREADCRUMB_SCHEMA = buildBreadcrumbSchema([
  { name: "Home", path: "/" },
  { name: "Thank You", path: "/thank-you" },
]);

export default function ThankYouPage() {
  return (
    <main className="wrapper">
      <JsonLd data={BREADCRUMB_SCHEMA} />
      <section data-section="thankyou" className="thankyou flex">
        <div>
          <h1>Thank You</h1>
          <p>Your form has been submitted successfully</p>
          <Link href="/">Back Home</Link>
        </div>
        <picture>
          <source
            media="(max-width: 540px)"
            srcSet="/assets/images/contact-banner.svg"
          />
          <Image
            src="/assets/images/contact-banner.svg"
            alt=""
            width={871}
            height={767}
            className="dark_img"
          />
        </picture>
      </section>
    </main>
  );
}

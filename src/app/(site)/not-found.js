import Image from "next/image";
import Link from "next/link";

export const metadata = {
  title: "Page Not Found | Webmaffia",
  description: "The page you are looking for does not exist.",
};

export default function NotFound() {
  return (
    <main className="wrapper">
      <section data-section="not-found" className="not-found flex">
        <div>
          <h1>404</h1>
          <p>Looks like this page took a wrong turn.</p>
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

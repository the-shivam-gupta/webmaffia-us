import Link from "next/link";

const CTA = ({ href = "/about", children, spanText = "About Us" }) => (
  <Link href={href} className="cta_text">
    {children || <>More <span>{spanText}</span></>}
  </Link>
);

export default CTA;

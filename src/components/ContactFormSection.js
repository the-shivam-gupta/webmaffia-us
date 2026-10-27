import KlaviyoFormEmbed from "@/components/KlaviyoFormEmbed";

export default function ContactFormSection({
  variant = "dark",
}) {
  const containerClass =
    variant === "light"
      ? "footer_container footer_container--light"
      : "footer_container";

  return (
    <div className={containerClass}>
      <div className="footer_title_wrap">
        <div className="footer_title">
          Drop <br />
          us a <br />
          message
        </div>
      </div>

      <div className="form">
        <KlaviyoFormEmbed />
      </div>
    </div>
  );
}

"use client";

const WHATSAPP_NUMBER = "9867625909"; // +91 9867625909

export default function WhatsAppCTA() {
  return (
    <>
      <a
        href={`https://wa.me/${WHATSAPP_NUMBER}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with us on WhatsApp"
        className="whatsapp-cta"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 32 32"
          width="32"
          height="32"
          fill="#ffffff"
          aria-hidden="true"
        >
          <path d="M16.004 3C9.377 3 4 8.373 4 15c0 2.34.687 4.523 1.872 6.36L4 29l7.84-1.83A11.93 11.93 0 0 0 16.004 27C22.63 27 28 21.627 28 15S22.63 3 16.004 3zm0 21.75c-1.98 0-3.83-.55-5.41-1.5l-.39-.23-4.65 1.09 1.11-4.53-.25-.4A9.7 9.7 0 0 1 5.25 15c0-5.93 4.82-10.75 10.754-10.75S26.75 9.07 26.75 15 21.938 24.75 16.004 24.75zm5.86-8.07c-.32-.16-1.9-.94-2.2-1.05-.29-.11-.5-.16-.72.16-.21.32-.82 1.05-1 1.26-.19.21-.37.24-.69.08-.32-.16-1.35-.5-2.58-1.6-.95-.85-1.6-1.9-1.79-2.22-.19-.32-.02-.49.14-.65.14-.14.32-.37.48-.55.16-.19.21-.32.32-.53.11-.21.05-.4-.03-.56-.08-.16-.72-1.73-.98-2.37-.26-.62-.53-.54-.72-.55h-.61c-.21 0-.56.08-.85.4-.29.32-1.11 1.08-1.11 2.63s1.14 3.05 1.3 3.26c.16.21 2.24 3.42 5.43 4.79.76.33 1.35.53 1.81.68.76.24 1.45.21 2 .13.61-.09 1.9-.78 2.17-1.53.27-.75.27-1.39.19-1.53-.08-.13-.29-.21-.61-.37z" />
        </svg>
      </a>

      <style jsx>{`
        .whatsapp-cta {
          position: fixed;
          bottom: 40px;
          right: 40px;
          z-index: 9999;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 56px;
          height: 56px;
          border-radius: 50%;
          background-color: #25d366;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.25);
          transition: transform 0.3s ease;
        }

        .whatsapp-cta:hover {
          animation: whatsapp-pulse 1.4s ease-out infinite;
        }

        @keyframes whatsapp-pulse {
          0% {
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.25), 0 0 0 0 rgba(37, 211, 102, 0.55);
          }
          70% {
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.25), 0 0 0 14px rgba(37, 211, 102, 0);
          }
          100% {
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.25), 0 0 0 0 rgba(37, 211, 102, 0);
          }
        }
      `}</style>
    </>
  );
}

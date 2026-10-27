"use client";

import { useEffect, useState } from "react";

// The Tawk.to script (RootShell.js) loads its own bubble and hides it; this button
// opens and closes the chat window through Tawk's API only (no CSS on Tawk's
// frames - that made the window open full-screen). It sits on top of Tawk's own
// close button, which is parked at the same spot, so it looks like one control.
const ROOT = () => document.documentElement;

function toggleChat() {
  const api = window.Tawk_API;
  if (!api || typeof api.maximize !== "function") return;
  if (ROOT().hasAttribute("data-chat-open")) {
    api.minimize?.();
    return;
  }
  ROOT().setAttribute("data-chat-open", "");
  api.showWidget?.();
  api.maximize();
}

export default function ChatCTA() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const root = ROOT();
    const attrs = new MutationObserver(() =>
      setOpen(root.hasAttribute("data-chat-open"))
    );
    attrs.observe(root, { attributes: true, attributeFilter: ["data-chat-open"] });
    return () => attrs.disconnect();
  }, []);

  return (
    <>
      <button
        type="button"
        aria-label={open ? "Close chat" : "Chat with us"}
        className={open ? "chat-cta chat-cta--open" : "chat-cta"}
        onClick={toggleChat}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          width="28"
          height="28"
          fill="#ffffff"
          aria-hidden="true"
        >
          {open ? (
            <path d="M7.41 8.59 12 13.17l4.59-4.58L18 10l-6 6-6-6z" />
          ) : (
            <path d="M12 2C6.48 2 2 5.92 2 10.75c0 2.55 1.26 4.84 3.27 6.44-.1 1.2-.5 2.5-1.5 3.6a.5.5 0 0 0 .5.82c2.1-.3 3.8-1.1 4.95-1.9.9.2 1.8.3 2.78.3 5.52 0 10-3.92 10-8.75S17.52 2 12 2z" />
          )}
        </svg>
      </button>

      <style jsx>{`
        .chat-cta {
          position: fixed;
          bottom: 40px;
          right: 40px;
          z-index: 2147483647;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 56px;
          height: 56px;
          padding: 0;
          border: 0;
          cursor: pointer;
          border-radius: 50%;
          background-color: #000000;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.25);
          transition: transform 0.3s ease;
        }

        .chat-cta:hover {
          animation: chat-pulse 1.4s ease-out infinite;
        }

        @keyframes chat-pulse {
          0% {
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.25), 0 0 0 0 rgba(0, 0, 0, 0.45);
          }
          70% {
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.25), 0 0 0 14px rgba(0, 0, 0, 0);
          }
          100% {
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.25), 0 0 0 0 rgba(0, 0, 0, 0);
          }
        }
      `}</style>
    </>
  );
}

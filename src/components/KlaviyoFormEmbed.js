"use client";

import { useEffect, useRef, useState } from "react";
import { KLAVIYO_EMBEDDED_FORM_ID } from "@/lib/klaviyo";

export default function KlaviyoFormEmbed({
  formId = KLAVIYO_EMBEDDED_FORM_ID,
  // Which service page the form sits on. Saved on the visitor's Klaviyo
  // profile (picked up when they submit) and added to the dataLayer event.
  service,
}) {
  const mountRef = useRef(null);
  const [failed, setFailed] = useState(false);

  // Klaviyo only scans the page for embed mount points when its script loads,
  // so after a client-side navigation (or a slow load) the form can stay
  // empty. Ask it to render the form again, and if it still has not shown up
  // after a few seconds, give up on the skeleton and show a fallback instead
  // of loading forever.
  useEffect(() => {
    const isEmpty = () => !mountRef.current?.hasChildNodes();
    const retry = () => {
      if (!isEmpty()) return;
      window._klOnsite = window._klOnsite || [];
      window._klOnsite.push(["openForm", formId]);
    };
    const t1 = setTimeout(retry, 1500);
    const t2 = setTimeout(retry, 4000);
    const t3 = setTimeout(() => {
      if (isEmpty()) setFailed(true);
    }, 9000);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [formId]);

  useEffect(() => {
    if (!service) return;
    // The init stub in KlaviyoScript queues this until klaviyo.js loads.
    window._klOnsite = window._klOnsite || [];
    window._klOnsite.push(["identify", { service }]);
  }, [service]);

  useEffect(() => {
    // Klaviyo renders its embedded forms asynchronously (often inside an
    // iframe), so GTM's built-in "Form Submission" trigger never sees a
    // native `submit` event on the page. Klaviyo instead dispatches a
    // `klaviyoForms` CustomEvent on `window` for form lifecycle events
    // (open/close/stepSubmit/submit). We forward the submit event to the
    // dataLayer so GTM can trigger off a custom event instead.
    function handleKlaviyoForm(event) {
      const detail = event?.detail;
      if (!detail || detail.type !== "submit") return;
      if (detail.formId && String(detail.formId) !== String(formId)) return;

      // Tie the service to the profile the form just created: identify with
      // the submitted email (a bare identify has nothing to attach to).
      const meta = detail.metaData || {};
      const email = meta.$email || meta.email;
      if (service && email) {
        window._klOnsite = window._klOnsite || [];
        window._klOnsite.push(["identify", { $email: email, service }]);
      }

      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
        event: "klaviyo_form_submit",
        klaviyoFormId: detail.formId,
        ...(service ? { service } : {}),
      });
    }

    window.addEventListener("klaviyoForms", handleKlaviyoForm);
    return () => window.removeEventListener("klaviyoForms", handleKlaviyoForm);
  }, [formId, service]);

  return (
    <div className="formWarpperx" data-failed={failed ? "" : undefined}>
      <div ref={mountRef} className={`klaviyo-form-${formId}`} />
      {failed ? (
        <p className="klaviyo_fallback">
          The form could not be loaded. Please email{" "}
          <a href="mailto:hello@webmaffia.com">hello@webmaffia.com</a> or call{" "}
          <a href="tel:+18669849786">+1 (866) 984-9786</a>.
        </p>
      ) : null}
    </div>
  );
}

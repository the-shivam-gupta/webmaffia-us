"use client";

import { useEffect } from "react";
import { KLAVIYO_EMBEDDED_FORM_ID } from "@/lib/klaviyo";

export default function KlaviyoFormEmbed({
  formId = KLAVIYO_EMBEDDED_FORM_ID,
  // Which service page the form sits on. Saved on the visitor's Klaviyo
  // profile (picked up when they submit) and added to the dataLayer event.
  service,
}) {
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
    <div className="formWarpperx">
      <div className={`klaviyo-form-${formId}`} />
    </div>
  );
}

"use client";

import { useEffect } from "react";
import { KLAVIYO_EMBEDDED_FORM_ID } from "@/lib/klaviyo";

export default function KlaviyoFormEmbed({
  formId = KLAVIYO_EMBEDDED_FORM_ID,
}) {
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

      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
        event: "klaviyo_form_submit",
        klaviyoFormId: detail.formId,
      });
    }

    window.addEventListener("klaviyoForms", handleKlaviyoForm);
    return () => window.removeEventListener("klaviyoForms", handleKlaviyoForm);
  }, [formId]);

  return (
    <div className="formWarpperx">
      <div className={`klaviyo-form-${formId}`} />
    </div>
  );
}

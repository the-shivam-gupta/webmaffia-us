import Script from "next/script";
import { KLAVIYO_COMPANY_ID } from "@/lib/klaviyo";

const KLAVIYO_INIT_SCRIPT = `
!function(){if(!window.klaviyo){window._klOnsite=window._klOnsite||[];try{window.klaviyo=new Proxy({},{get:function(n,i){return"push"===i?function(){var n;(n=window._klOnsite).push.apply(n,arguments)}:function(){for(var n=arguments.length,o=new Array(n),w=0;w<n;w++)o[w]=arguments[w];var t="function"==typeof o[o.length-1]?o.pop():void 0,e=new Promise((function(n){window._klOnsite.push([i].concat(o,[function(i){t&&t(i),n(i)}]))}));return e}}})}catch(n){window.klaviyo=window.klaviyo||[],window.klaviyo.push=function(){var n;(n=window._klOnsite).push.apply(n,arguments)}}}}();
`;

// Forwards Klaviyo form lifecycle events to the dataLayer, so GTM
// triggers (and downstream GA4 tags) can listen for them.
const KLAVIYO_GTM_TRACKING_SCRIPT = `
window.addEventListener("klaviyoForms", function (event) {
  if (!event.detail || !event.detail.type) return;

  var eventMap = {
    open: "form_open",
    viewedStep: "form_step_view",
    stepSubmit: "form_step_submit",
    submit: "form_submit",
    close: "form_close",
    redirectedToUrl: "form_redirect"
  };

  var mappedEvent = eventMap[event.detail.type];
  if (!mappedEvent) return;

  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    event: mappedEvent,
    klaviyoFormId: event.detail.formId,
    klaviyoFormVersionId: event.detail.formVersionId,
    klaviyoCompanyId: event.detail.companyId
  });
});
`;

export default function KlaviyoScript() {
  return (
    <>
      <Script id="klaviyo-init" strategy="beforeInteractive">
        {KLAVIYO_INIT_SCRIPT}
      </Script>
      <Script
        id="klaviyo-onsite"
        src={`https://static.klaviyo.com/onsite/js/${KLAVIYO_COMPANY_ID}/klaviyo.js?company_id=${KLAVIYO_COMPANY_ID}`}
        strategy="afterInteractive"
      />
      <Script id="klaviyo-gtm-tracking" strategy="afterInteractive">
        {KLAVIYO_GTM_TRACKING_SCRIPT}
      </Script>
    </>
  );
}

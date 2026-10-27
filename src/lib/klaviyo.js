export const KLAVIYO_COMPANY_ID = "VNRWsD";
export const KLAVIYO_EMBEDDED_FORM_ID = "TWwQKi";
export const KLAVIYO_POPUP_FORM_ID = "SuDJiL";

export function openKlaviyoPopup(formId = KLAVIYO_POPUP_FORM_ID) {
  if (typeof window === "undefined") return;

  window._klOnsite = window._klOnsite || [];
  window._klOnsite.push(["openForm", formId]);
}

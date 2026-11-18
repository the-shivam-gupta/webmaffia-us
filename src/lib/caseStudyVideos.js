import { getMediaUrlsByIds } from "@/lib/strapiPage";

// Case studies that carry a short summary video: slug -> config.
//
// `mediaId` is the file's ID in the Strapi media library (the "Asset ID" shown
// in the file's Details panel). The page looks the current URL up by that ID,
// so replacing the file in Strapi (which keeps the ID) changes the video here
// without a code change. `fallbackSrc` is used only if Strapi can't be reached.
export const CASE_STUDY_VIDEOS = {
  "sanyo-special-steel": {
    mediaId: 741,
    fallbackSrc: "https://cms.webmaffia.com/uploads/sanyo_7712626d4c.mp4",
    title: "Sanyo Special Steel",
    label: "Watch the summary",
  },
};

/**
 * Props for <CaseStudyVideo> for a case-study slug (`{ src, title, label }`),
 * or null when that case study has no video.
 */
export async function getCaseStudyVideo(slug) {
  const config = CASE_STUDY_VIDEOS[slug];
  if (!config) return null;

  const urls = await getMediaUrlsByIds([config.mediaId]);
  const src = urls[config.mediaId] || config.fallbackSrc;
  if (!src) return null;

  return { src, title: config.title, label: config.label };
}

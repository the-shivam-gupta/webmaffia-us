/**
 * Splits a Strapi award `details` text (one item per line: year, rank, then
 * the description) into its parts.
 *
 *   "2015\nGold\n\nBest use of Animation\nfor AM / NS India"
 *   -> { year: "2015", type: "Gold", description: "Best use of Animation\nfor AM / NS India" }
 */
export function parseAwardDetails(details) {
  const lines = (details || "").split("\n").map((s) => s.trim());
  const nonEmpty = lines.filter(Boolean);
  return {
    year: nonEmpty[0] || "",
    type: nonEmpty[1] || "",
    description: nonEmpty.slice(2).join("\n"),
  };
}

/**
 * Hover caption for an award logo, in the format the homepage's award cards
 * use: first line "year · rank", then the award name, then the description.
 */
export function buildAwardCaption({ name, details }) {
  const { year, type, description } = parseAwardDetails(details);
  const eyebrow = [year, type].filter(Boolean).join(" · ");
  return [eyebrow, name, ...description.split("\n")]
    .map((line) => line?.trim())
    .filter(Boolean)
    .join("\n");
}

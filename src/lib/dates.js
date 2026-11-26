const MONTHS = [
  "January", "February", "March", "April", "May", "June", "July",
  "August", "September", "October", "November", "December",
];

/**
 * "2026-11-18T09:00:00.000Z" -> { iso: "2026-11-18", label: "18 November 2026" }.
 * Formatted manually (UTC) so server and client never disagree on timezone.
 * Returns null for a missing or invalid date.
 */
export function formatUpdatedAt(value) {
  const date = value ? new Date(value) : null;
  if (!date || Number.isNaN(date.getTime())) return null;
  return {
    iso: date.toISOString().slice(0, 10),
    label: `${date.getUTCDate()} ${MONTHS[date.getUTCMonth()]} ${date.getUTCFullYear()}`,
  };
}

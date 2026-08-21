export const CORNWALL_LOCATIONS = [
  "Newquay",
  "St Ives",
  "Falmouth",
  "Padstow",
  "Truro",
  "Penzance",
  "Rock",
  "Bude",
  "Looe",
  "Fowey",
  "Port Isaac",
  "St Austell",
  "Helston",
  "Bodmin",
  "Camborne",
  "Perranporth",
  "Mousehole",
  "Mevagissey",
  "Other Cornwall",
] as const;

export const CATEGORIES = [
  { value: "kitchen", label: "Kitchen & Chefs" },
  { value: "front-of-house", label: "Front of House" },
  { value: "bar", label: "Bar & Baristas" },
  { value: "housekeeping", label: "Housekeeping" },
  { value: "management", label: "Management" },
  { value: "events", label: "Events & Weddings" },
  { value: "other", label: "Other" },
] as const;

export const JOB_TYPES = [
  "Full-time",
  "Part-time",
  "Seasonal",
  "Temporary",
  "Casual / Shifts",
  "Apprenticeship",
] as const;

export const APPLICATION_STATUSES = [
  { value: "new", label: "New" },
  { value: "reviewing", label: "Reviewing" },
  { value: "interview", label: "Interview" },
  { value: "hired", label: "Hired" },
  { value: "rejected", label: "Not progressing" },
] as const;

export function categoryLabel(value: string) {
  return CATEGORIES.find((c) => c.value === value)?.label ?? "Other";
}

export function formatPay(
  min: number | null,
  max: number | null,
  period: string | null,
): string {
  if (min == null && max == null) return "Pay on application";
  const unit = period === "year" ? "/yr" : period === "week" ? "/wk" : "/hr";
  const fmt = (n: number) =>
    period === "year" ? `£${Math.round(n).toLocaleString("en-GB")}` : `£${n.toFixed(2)}`;
  if (min != null && max != null && min !== max) return `${fmt(min)} – ${fmt(max)}${unit}`;
  return `${fmt((min ?? max) as number)}${unit}`;
}

export function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const days = Math.floor(diff / 86400000);
  if (days < 1) return "Today";
  if (days === 1) return "Yesterday";
  if (days < 30) return `${days} days ago`;
  return `${Math.floor(days / 30)} mo ago`;
}

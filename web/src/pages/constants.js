export const SUBJECT_COLORS = { DBMS: "#60a5fa", Math: "#f472b6", CS: "#4ade80", English: "#fbbf24", Physics: "#a78bfa", default: "#fb923c" };

export const PRIORITY_STYLES = {
  high: { label: "High", bg: "rgba(239,68,68,0.15)", text: "#f87171" },
  medium: { label: "Med", bg: "rgba(251,191,36,0.15)", text: "#fbbf24" },
  low: { label: "Low", bg: "rgba(74,222,128,0.15)", text: "#4ade80" }
};

export const LOG_ICONS = { auth: "🔐", complete: "✅", add: "➕", delete: "🗑️" };

export function formatDeadline(dateStr) {
  const d = new Date(dateStr);
  const now = new Date();
  const diff = Math.ceil((d - now) / (1000 * 60 * 60 * 24));
  if (diff < 0) return { label: "Overdue", urgent: true };
  if (diff === 0) return { label: "Due Today", urgent: true };
  if (diff === 1) return { label: "Tomorrow", urgent: true };
  return { label: `${diff}d left`, urgent: false };
}
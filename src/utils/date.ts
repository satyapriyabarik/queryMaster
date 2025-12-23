/* =========================
   Internal helper
   ========================= */
function toDate(value: Date | string | number | undefined | null): Date | null {
  if (!value) return null;

  // Already a Date
  if (value instanceof Date) {
    return isNaN(value.getTime()) ? null : value;
  }

  // Number or numeric string (timestamp)
  if (
    typeof value === "number" ||
    (typeof value === "string" && /^\d+$/.test(value))
  ) {
    const d = new Date(Number(value));
    return isNaN(d.getTime()) ? null : d;
  }

  // MySQL datetime: "YYYY-MM-DD HH:mm:ss"
  if (typeof value === "string") {
    const normalized = value.replace(" ", "T");
    const d = new Date(normalized);
    return isNaN(d.getTime()) ? null : d;
  }

  return null;
}

/* =========================
   Date only (for grids, cards)
   ========================= */
export function formatDate(
  value: Date | string | number | undefined | null
): string {
  const date = toDate(value);
  if (!date) return "—";

  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric"
  });
}

/* =========================
   Date + time (for history, logs)
   ========================= */
export function formatDateTime(
  value: Date | string | number | undefined | null
): string {
  const date = toDate(value);
  if (!date) return "—";

  return date.toLocaleString(undefined, {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit"
  });
}

/* =========================
   Backward compatibility
   (keep existing imports working)
   ========================= */
export const parseMySQLDate = formatDateTime;

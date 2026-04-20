/** Local calendar YYYY-MM-DD for stable RPC seed (matches user timezone). */
export function localCalendarSeedDate(d = new Date()) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export function formatFeastMonthDay(month: number, day: number) {
  const d = new Date(2000, month - 1, day);
  return d.toLocaleDateString('en-US', { month: 'long', day: 'numeric' });
}

export function formatOptionalIsoDate(iso: string | null) {
  if (!iso) return null;
  const d = new Date(`${iso}T12:00:00`);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
}

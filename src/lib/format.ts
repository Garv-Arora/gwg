export function formatINR(value: number, opts: { compact?: boolean } = {}): string {
  const n = Math.round(value);
  if (opts.compact && Math.abs(n) >= 100000) {
    return `₹${(n / 100000).toFixed(1).replace(/\.0$/, "")}L`;
  }
  if (opts.compact && Math.abs(n) >= 1000) {
    return `₹${(n / 1000).toFixed(1).replace(/\.0$/, "")}k`;
  }
  return `₹${n.toLocaleString("en-IN")}`;
}

export function formatRelative(iso: string): string {
  const then = new Date(iso).getTime();
  const now = Date.now();
  const diff = Math.max(0, now - then);
  const m = Math.floor(diff / 60_000);
  if (m < 1) return "abhi";
  if (m < 60) return `${m}m`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h`;
  const d = Math.floor(h / 24);
  if (d < 7) return `${d}d`;
  const w = Math.floor(d / 7);
  if (w < 4) return `${w}w`;
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
  });
}

export function initials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

const PALETTE = [
  "#22C55E", // mint
  "#FACC15", // gold
  "#60A5FA", // blue
  "#F472B6", // pink
  "#A78BFA", // violet
  "#FB923C", // orange
  "#34D399", // emerald
  "#F87171", // red
];

export function avatarColor(seed: string): string {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) | 0;
  return PALETTE[Math.abs(h) % PALETTE.length];
}

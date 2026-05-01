"use client";

const KEY = "udhariclub:identity";

export type LocalIdentity = {
  user_id: string;
  phone: string;
  name: string;
};

export function getIdentity(): LocalIdentity | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed?.phone || !parsed?.name) return null;
    return { user_id: parsed.user_id ?? "", phone: parsed.phone, name: parsed.name };
  } catch {
    return null;
  }
}

export function setIdentity(identity: LocalIdentity): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(KEY, JSON.stringify(identity));
}

export function clearIdentity(): void {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(KEY);
}

export function normalizePhone(input: string): string {
  // Strip everything but digits and +. Keep last 10 digits if no country code.
  const trimmed = input.trim().replace(/[^\d+]/g, "");
  if (trimmed.startsWith("+")) return trimmed;
  if (trimmed.length === 10) return `+91${trimmed}`;
  if (trimmed.length === 12 && trimmed.startsWith("91")) return `+${trimmed}`;
  return trimmed;
}

export function isValidPhone(input: string): boolean {
  const p = normalizePhone(input);
  return /^\+\d{10,15}$/.test(p);
}

const RECENT_TRIPS_KEY = "udhariclub:recentTrips";

export type RecentTrip = {
  id: string;
  name: string;
  emoji: string;
  invite_code: string;
  last_seen: number;
};

export function getRecentTrips(): RecentTrip[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(RECENT_TRIPS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as RecentTrip[];
    return parsed.sort((a, b) => b.last_seen - a.last_seen);
  } catch {
    return [];
  }
}

export function rememberTrip(trip: Omit<RecentTrip, "last_seen">): void {
  if (typeof window === "undefined") return;
  const existing = getRecentTrips().filter((t) => t.id !== trip.id);
  const next = [{ ...trip, last_seen: Date.now() }, ...existing].slice(0, 8);
  window.localStorage.setItem(RECENT_TRIPS_KEY, JSON.stringify(next));
}

export function forgetTrip(id: string): void {
  if (typeof window === "undefined") return;
  const next = getRecentTrips().filter((t) => t.id !== id);
  window.localStorage.setItem(RECENT_TRIPS_KEY, JSON.stringify(next));
}

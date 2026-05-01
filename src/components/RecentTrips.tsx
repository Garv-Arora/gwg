"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getRecentTrips, type RecentTrip } from "@/lib/identity";

export function RecentTrips() {
  const [trips, setTrips] = useState<RecentTrip[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setTrips(getRecentTrips());
    setReady(true);
  }, []);

  if (!ready || trips.length === 0) return null;

  return (
    <section className="mt-8">
      <h2 className="text-sm font-semibold text-ink-secondary mb-3">
        Your recent trips
      </h2>
      <div className="flex gap-3 overflow-x-auto scrollbar-thin -mx-4 px-4 pb-2">
        {trips.map((t) => (
          <Link
            key={t.id}
            href={`/trip/${t.id}`}
            className="shrink-0 w-44 rounded-card bg-card border border-white/[0.04] p-4 hover:border-mint/30 transition no-tap-highlight"
          >
            <div className="text-2xl">{t.emoji || "🌴"}</div>
            <p className="mt-3 font-display font-semibold text-ink-primary truncate">
              {t.name}
            </p>
            <p className="text-xs text-ink-muted mt-0.5">
              code · {t.invite_code}
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
}

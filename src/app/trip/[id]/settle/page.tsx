"use client";

import { useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { AppShell } from "@/components/AppShell";
import { Card, CardHeader } from "@/components/Card";
import { Button } from "@/components/Button";
import { EmptyState } from "@/components/EmptyState";
import { SettlementCard } from "@/components/SettlementCard";
import { MoneyText } from "@/components/MoneyText";
import { useTrip } from "@/components/TripContext";
import { useToast } from "@/components/Toast";
import { computeBalances, simplifySettlements } from "@/lib/settle";
import { buildGroupSummary, buildPersonalReminder, waLink } from "@/lib/wa";
import { api } from "@/lib/api";
import type { Transfer, TripMember } from "@/types";
import { Avatar } from "@/components/MemberChip";

export default function SettlePage() {
  const params = useParams<{ id: string }>();
  const tripId = (params.id ?? "").toString();
  const { state, refresh } = useTrip();
  const toast = useToast();
  const [busyKey, setBusyKey] = useState<string | null>(null);

  const data = useMemo(() => {
    if (state.status !== "ready") return null;
    const balances = computeBalances(state.members, state.expenses, state.settlements);
    const transfers = simplifySettlements(balances);
    const byId: Record<string, TripMember> = {};
    for (const m of state.members) byId[m.id] = m;
    return { balances, transfers, byId };
  }, [state]);

  if (state.status !== "ready" || !data) {
    return (
      <AppShell title="Settle up" back={`/trip/${tripId}`}>
        <div className="h-32 rounded-card bg-soft/30 animate-pulse" />
      </AppShell>
    );
  }

  const { trip, settlements } = state;
  const { balances, transfers, byId } = data;

  const settledTransfers = settlements.filter((s) => s.status === "settled");
  const pendingRecorded = settlements.filter((s) => s.status === "pending");

  const totalToSettle = transfers.reduce((a, t) => a + t.amount, 0);
  const appUrl =
    typeof window !== "undefined"
      ? window.location.origin
      : process.env.NEXT_PUBLIC_APP_URL || "";

  const groupShareText = buildGroupSummary(
    trip.name,
    trip.emoji,
    transfers,
    byId,
    appUrl,
    trip.invite_code,
  );
  const groupShareHref = waLink(groupShareText);

  async function markSettled(t: Transfer) {
    const key = `${t.from}-${t.to}-${t.amount}`;
    setBusyKey(key);
    try {
      await api.createSettlement(tripId, {
        from_member: t.from,
        to_member: t.to,
        amount: t.amount,
        status: "settled",
      });
      toast.show("Marked settled — sab clear ✨", "success");
      await refresh();
    } catch (err) {
      toast.show(err instanceof Error ? err.message : "Couldn't update", "error");
    } finally {
      setBusyKey(null);
    }
  }

  async function unsettle(id: string) {
    setBusyKey(id);
    try {
      await api.deleteSettlement(id);
      await refresh();
    } catch (err) {
      toast.show(err instanceof Error ? err.message : "Couldn't undo", "error");
    } finally {
      setBusyKey(null);
    }
  }

  return (
    <AppShell title="Settle up" back={`/trip/${tripId}`}>
      <Card className="relative overflow-hidden">
        <div className="absolute -top-12 -right-12 h-40 w-40 rounded-full bg-gold/20 blur-3xl" />
        <p className="text-[11px] uppercase tracking-widest text-ink-muted">
          To be settled
        </p>
        <p className="mt-1">
          <MoneyText value={totalToSettle} size="hero" tone="gold" />
        </p>
        <p className="mt-1 text-sm text-ink-muted">
          {transfers.length === 0
            ? "Sab barabar — no one owes anyone."
            : `${transfers.length} smart transfer${transfers.length === 1 ? "" : "s"} will close all balances.`}
        </p>

        {transfers.length > 0 && (
          <a
            href={groupShareHref}
            target="_blank"
            rel="noreferrer"
            className="mt-4 inline-flex w-full justify-center items-center gap-2 h-12 rounded-pill bg-[#25D366] text-bg font-semibold"
          >
            Share plan on WhatsApp
          </a>
        )}
      </Card>

      <div className="mt-6">
        <CardHeader
          title="Suggested transfers"
          subtitle="Minimum number of payments to clear all balances."
        />
        {transfers.length === 0 ? (
          <EmptyState
            emoji="🌿"
            title="All settled"
            body="No outstanding udhari. Yeh feeling, beautiful hai."
          />
        ) : (
          <div className="space-y-3">
            {transfers.map((t) => {
              const key = `${t.from}-${t.to}-${t.amount}`;
              const from = byId[t.from];
              const to = byId[t.to];
              const personalText = buildPersonalReminder(
                trip.name,
                to?.display_name ?? "you",
                from?.display_name ?? "friend",
                t.amount,
              );
              const waHref = waLink(personalText, from?.phone ?? null);
              return (
                <SettlementCard
                  key={key}
                  from={from}
                  to={to}
                  amount={t.amount}
                  status="pending"
                  busy={busyKey === key}
                  onSettle={() => markSettled(t)}
                  onWhatsapp={() => window.open(waHref, "_blank")}
                />
              );
            })}
          </div>
        )}
      </div>

      <div className="mt-6">
        <CardHeader
          title="Per-person balance"
          subtitle="Positive = should receive. Negative = owes."
        />
        <div className="space-y-2">
          {balances
            .slice()
            .sort((a, b) => b.net - a.net)
            .map((b) => {
              const m = byId[b.member_id];
              return (
                <Card
                  key={b.member_id}
                  variant="soft"
                  className="flex items-center gap-3"
                >
                  <Avatar name={m?.display_name ?? "?"} size="md" />
                  <div className="flex-1 min-w-0">
                    <p className="text-ink-primary font-medium truncate">
                      {m?.display_name}
                    </p>
                  </div>
                  <MoneyText
                    value={b.net}
                    size="md"
                    tone={b.net > 0 ? "credit" : b.net < 0 ? "debit" : "neutral"}
                    showSign
                  />
                </Card>
              );
            })}
        </div>
      </div>

      {settledTransfers.length > 0 && (
        <div className="mt-6">
          <CardHeader
            title="Already settled"
            subtitle="Tap undo if someone changed their mind."
          />
          <div className="space-y-3">
            {settledTransfers.map((s) => (
              <SettlementCard
                key={s.id}
                from={byId[s.from_member]}
                to={byId[s.to_member]}
                amount={Number(s.amount)}
                status="settled"
                busy={busyKey === s.id}
                onUnsettle={() => unsettle(s.id)}
              />
            ))}
          </div>
        </div>
      )}

      {pendingRecorded.length > 0 && (
        <div className="mt-6">
          <CardHeader title="Pending (recorded)" />
          <div className="space-y-3">
            {pendingRecorded.map((s) => (
              <SettlementCard
                key={s.id}
                from={byId[s.from_member]}
                to={byId[s.to_member]}
                amount={Number(s.amount)}
                status="pending"
                busy={busyKey === s.id}
                onSettle={async () => {
                  setBusyKey(s.id);
                  try {
                    await api.setSettlementStatus(s.id, "settled");
                    await refresh();
                  } catch (err) {
                    toast.show(
                      err instanceof Error ? err.message : "Couldn't update",
                      "error",
                    );
                  } finally {
                    setBusyKey(null);
                  }
                }}
              />
            ))}
          </div>
        </div>
      )}

      <div className="mt-8">
        <Button
          full
          variant="secondary"
          size="lg"
          onClick={() => window.open(groupShareHref, "_blank")}
        >
          Share full summary
        </Button>
      </div>
    </AppShell>
  );
}

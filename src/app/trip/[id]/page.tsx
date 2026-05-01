"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { AppShell } from "@/components/AppShell";
import { Card, CardHeader } from "@/components/Card";
import { Button, LinkButton } from "@/components/Button";
import { MoneyText } from "@/components/MoneyText";
import { ExpenseCard } from "@/components/ExpenseCard";
import { EmptyState } from "@/components/EmptyState";
import { Avatar, MemberChip } from "@/components/MemberChip";
import { useTrip } from "@/components/TripContext";
import { useToast } from "@/components/Toast";
import { computeBalances, simplifySettlements } from "@/lib/settle";
import { getIdentity, rememberTrip } from "@/lib/identity";
import { formatINR } from "@/lib/format";

export default function TripDashboardPage() {
  const params = useParams<{ id: string }>();
  const tripId = (params.id ?? "").toString();
  const search = useSearchParams();
  const justCreated = search.get("welcome") === "1";

  const { state, refresh } = useTrip();
  const toast = useToast();
  const [meId, setMeId] = useState<string | null>(null);
  const [showInvite, setShowInvite] = useState(justCreated);

  useEffect(() => {
    if (state.status === "ready") {
      rememberTrip({
        id: state.trip.id,
        name: state.trip.name,
        emoji: state.trip.emoji,
        invite_code: state.trip.invite_code,
      });
      const me = getIdentity();
      if (me) {
        const found = state.members.find((m) => m.phone === me.phone);
        setMeId(found?.id ?? null);
      }
    }
  }, [state]);

  const totals = useMemo(() => {
    if (state.status !== "ready") return null;
    const total = state.expenses.reduce((a, e) => a + Number(e.amount), 0);
    const balances = computeBalances(state.members, state.expenses, state.settlements);
    const transfers = simplifySettlements(balances);
    return { total, balances, transfers };
  }, [state]);

  if (state.status === "loading") {
    return (
      <AppShell title="Loading..." back="/">
        <Card><div className="h-24 animate-pulse bg-soft/40 rounded-2xl" /></Card>
      </AppShell>
    );
  }

  if (state.status === "error") {
    return (
      <AppShell title="Error" back="/">
        <EmptyState
          emoji="🤔"
          title="Couldn't load trip"
          body={state.error}
          action={<Button onClick={refresh}>Try again</Button>}
        />
      </AppShell>
    );
  }

  const { trip, members, expenses, settlements } = state;
  const meBalance = meId
    ? totals?.balances.find((b) => b.member_id === meId)?.net ?? 0
    : 0;

  const inviteUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/join/${trip.invite_code}`
      : `/join/${trip.invite_code}`;

  return (
    <AppShell
      title={`${trip.emoji} ${trip.name}`}
      back="/"
      right={
        <button
          onClick={() => setShowInvite(true)}
          className="h-9 px-3 text-xs font-semibold rounded-pill bg-mint-soft text-mint border border-mint/30"
        >
          Invite
        </button>
      }
    >
      {showInvite && (
        <InviteSheet
          inviteCode={trip.invite_code}
          inviteUrl={inviteUrl}
          tripName={trip.name}
          onClose={() => setShowInvite(false)}
        />
      )}

      <Card className="relative overflow-hidden">
        <div className="absolute -top-12 -right-12 h-40 w-40 rounded-full bg-mint/20 blur-3xl" />
        <div className="absolute -bottom-12 -left-12 h-40 w-40 rounded-full bg-gold/10 blur-3xl" />
        <div className="relative">
          <p className="text-[11px] uppercase tracking-widest text-ink-muted">
            Total spend
          </p>
          <p className="mt-1 font-display font-bold text-5xl tracking-tight text-ink-primary">
            {formatINR(totals?.total ?? 0)}
          </p>
          <p className="mt-1 text-sm text-ink-muted">
            {expenses.length} expense{expenses.length === 1 ? "" : "s"} ·{" "}
            {members.length} member{members.length === 1 ? "" : "s"}
          </p>

          {meId && (
            <div className="mt-5 rounded-2xl bg-bg/40 border border-white/[0.04] p-3 flex items-center justify-between">
              <div>
                <p className="text-[11px] uppercase tracking-widest text-ink-muted">
                  Your balance
                </p>
                <MoneyText
                  value={meBalance}
                  size="lg"
                  tone={meBalance > 0 ? "credit" : meBalance < 0 ? "debit" : "neutral"}
                  showSign
                />
              </div>
              <p className="text-xs text-ink-muted text-right max-w-[40%] leading-tight">
                {meBalance > 0
                  ? "You should receive"
                  : meBalance < 0
                    ? "You owe the group"
                    : "All settled"}
              </p>
            </div>
          )}

          <div className="mt-5 grid grid-cols-2 gap-2">
            <LinkButton href={`/trip/${tripId}/add`} variant="primary" full>
              + Add expense
            </LinkButton>
            <LinkButton href={`/trip/${tripId}/settle`} variant="gold" full>
              Settle up
            </LinkButton>
          </div>
        </div>
      </Card>

      <div className="mt-5">
        <CardHeader
          title="Members"
          right={
            <Link
              href={`/trip/${tripId}/members`}
              className="text-xs text-mint font-semibold"
            >
              Manage
            </Link>
          }
        />
        <div className="flex gap-2 overflow-x-auto scrollbar-thin -mx-4 px-4 pb-2">
          {members.map((m) => {
            const bal = totals?.balances.find((b) => b.member_id === m.id)?.net ?? 0;
            const tone = bal > 0 ? "mint" : bal < 0 ? "danger" : "ink-muted";
            return (
              <div
                key={m.id}
                className="shrink-0 w-32 rounded-card bg-card border border-white/[0.04] p-3 text-center"
              >
                <div className="flex justify-center">
                  <Avatar name={m.display_name} size="lg" ringClass="ring-card" />
                </div>
                <p className="mt-2 text-sm font-medium text-ink-primary truncate">
                  {m.display_name}
                </p>
                <p
                  className={`mt-1 text-[13px] font-semibold tabular-nums ${
                    tone === "mint"
                      ? "text-mint"
                      : tone === "danger"
                        ? "text-danger"
                        : "text-ink-muted"
                  }`}
                >
                  {bal === 0 ? "settled" : `${bal > 0 ? "+" : "−"}${formatINR(Math.abs(bal))}`}
                </p>
              </div>
            );
          })}
          <Link
            href={`/trip/${tripId}/members`}
            className="shrink-0 w-32 rounded-card border-2 border-dashed border-white/10 p-3 text-center grid place-items-center text-ink-muted hover:text-mint hover:border-mint/40"
          >
            <div>
              <div className="text-2xl">+</div>
              <p className="text-xs mt-1">Add</p>
            </div>
          </Link>
        </div>
      </div>

      {totals && totals.transfers.length > 0 && (
        <Card variant="gold" className="mt-5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="font-display font-semibold text-gold">
                Settle in just {totals.transfers.length} transfer
                {totals.transfers.length === 1 ? "" : "s"}
              </p>
              <p className="text-sm text-ink-secondary mt-1">
                Tap below to see the simplified plan and ping on WhatsApp.
              </p>
            </div>
            <span className="text-3xl">🌿</span>
          </div>
          <LinkButton href={`/trip/${tripId}/settle`} variant="gold" full className="mt-3">
            Open settlement
          </LinkButton>
        </Card>
      )}

      <div className="mt-6">
        <CardHeader
          title="Expense feed"
          right={
            <Link
              href={`/trip/${tripId}/add`}
              className="text-xs text-mint font-semibold"
            >
              + Add
            </Link>
          }
        />

        {expenses.length === 0 ? (
          <EmptyState
            emoji="🪙"
            title="No expenses yet"
            body="Add the first one — chai, cab, ya hotel — kuch bhi."
            action={
              <LinkButton href={`/trip/${tripId}/add`} variant="primary">
                Add expense
              </LinkButton>
            }
          />
        ) : (
          <div className="space-y-3">
            {expenses.map((e) => {
              const payer = members.find((m) => m.id === e.payer_id);
              const participants = members.filter((m) =>
                e.splits.some((s) => s.member_id === m.id),
              );
              return (
                <ExpenseCard
                  key={e.id}
                  expense={e}
                  payer={payer}
                  participants={participants}
                  href={`/trip/${tripId}/expense/${e.id}`}
                  perspectiveMemberId={meId}
                />
              );
            })}
          </div>
        )}
      </div>

      {settlements.filter((s) => s.status === "settled").length > 0 && (
        <div className="mt-6">
          <CardHeader title="Already settled" />
          <div className="space-y-2">
            {settlements
              .filter((s) => s.status === "settled")
              .map((s) => {
                const from = members.find((m) => m.id === s.from_member);
                const to = members.find((m) => m.id === s.to_member);
                return (
                  <Card
                    key={s.id}
                    variant="soft"
                    className="flex items-center gap-3"
                  >
                    <Avatar name={from?.display_name ?? "?"} size="sm" />
                    <div className="flex-1 text-sm">
                      <span className="text-ink-primary">{from?.display_name}</span>{" "}
                      <span className="text-ink-muted">paid</span>{" "}
                      <span className="text-ink-primary">{to?.display_name}</span>
                    </div>
                    <MoneyText value={Number(s.amount)} size="sm" tone="credit" />
                  </Card>
                );
              })}
          </div>
        </div>
      )}
    </AppShell>
  );
}

function InviteSheet({
  inviteCode,
  inviteUrl,
  tripName,
  onClose,
}: {
  inviteCode: string;
  inviteUrl: string;
  tripName: string;
  onClose: () => void;
}) {
  const toast = useToast();

  async function copy(text: string) {
    try {
      await navigator.clipboard.writeText(text);
      toast.show("Copied!", "success");
    } catch {
      toast.show("Couldn't copy", "error");
    }
  }

  const waText = `Aaja ${tripName} pe! Apne kharche track karte hain UdhariClub pe 👇\n\n${inviteUrl}`;
  const waHref = `https://wa.me/?text=${encodeURIComponent(waText)}`;

  return (
    <div className="fixed inset-0 z-40 grid place-items-end sm:place-items-center bg-black/60 backdrop-blur-sm animate-rise">
      <div className="w-full max-w-[430px] bg-card rounded-t-card sm:rounded-card border border-white/[0.06] p-5 m-0 sm:m-4">
        <div className="flex items-center justify-between">
          <p className="font-display font-semibold text-ink-primary">
            Invite to {tripName}
          </p>
          <button
            onClick={onClose}
            className="h-8 w-8 grid place-items-center rounded-full bg-soft/60 text-ink-muted"
          >
            ✕
          </button>
        </div>
        <div className="mt-4 rounded-card bg-bg/60 p-5 text-center border border-mint/20">
          <p className="text-[11px] uppercase tracking-widest text-ink-muted">
            invite code
          </p>
          <p className="mt-2 text-4xl font-display font-bold tracking-[0.4em] text-ink-primary">
            {inviteCode}
          </p>
        </div>
        <div className="mt-3 rounded-input bg-soft/40 px-3 py-2 text-xs text-ink-secondary truncate">
          {inviteUrl}
        </div>
        <div className="mt-4 grid grid-cols-2 gap-2">
          <Button variant="secondary" onClick={() => copy(inviteUrl)}>
            Copy link
          </Button>
          <a
            href={waHref}
            target="_blank"
            rel="noreferrer"
            className="h-11 inline-flex items-center justify-center rounded-pill bg-[#25D366] text-bg font-semibold"
          >
            Share on WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
}

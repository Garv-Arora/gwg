"use client";

import { useEffect, useMemo, useState } from "react";
import { Card } from "./Card";
import { Button } from "./Button";
import { Avatar, MemberChip } from "./MemberChip";
import { MoneyText } from "./MoneyText";
import { buildEqualSplit } from "@/lib/settle";
import type { ExpenseWithSplits, SplitType, TripMember } from "@/types";
import { formatINR } from "@/lib/format";

type Submission = {
  payer_id: string;
  description: string;
  amount: number;
  split_type: SplitType;
  splits: { member_id: string; amount: number }[];
};

type Props = {
  members: TripMember[];
  defaultPayerId?: string;
  initial?: ExpenseWithSplits;
  submitLabel: string;
  onSubmit: (s: Submission) => Promise<void> | void;
  onDelete?: () => Promise<void> | void;
};

export function ExpenseForm({
  members,
  defaultPayerId,
  initial,
  submitLabel,
  onSubmit,
  onDelete,
}: Props) {
  const [description, setDescription] = useState(initial?.description ?? "");
  const [amount, setAmount] = useState<string>(
    initial ? String(initial.amount) : "",
  );
  const [payerId, setPayerId] = useState<string>(
    initial?.payer_id ?? defaultPayerId ?? members[0]?.id ?? "",
  );
  const [splitType, setSplitType] = useState<SplitType>(
    initial?.split_type ?? "equal",
  );
  const [participants, setParticipants] = useState<Record<string, boolean>>(
    () => {
      if (initial) {
        const map: Record<string, boolean> = {};
        for (const s of initial.splits) map[s.member_id] = true;
        return map;
      }
      const all: Record<string, boolean> = {};
      for (const m of members) all[m.id] = true;
      return all;
    },
  );
  const [shares, setShares] = useState<Record<string, string>>(() => {
    const m: Record<string, string> = {};
    if (initial) {
      for (const s of initial.splits) m[s.member_id] = String(s.amount);
    }
    return m;
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const amountNum = Number(amount.replace(/[, ]/g, "")) || 0;
  const selectedIds = useMemo(
    () => members.filter((m) => participants[m.id]).map((m) => m.id),
    [members, participants],
  );

  const equalSplit = useMemo(
    () => buildEqualSplit(amountNum, selectedIds),
    [amountNum, selectedIds],
  );

  const unequalSum = useMemo(
    () =>
      selectedIds.reduce((acc, id) => {
        const v = Number(shares[id]?.replace(/[, ]/g, "") ?? "0") || 0;
        return acc + v;
      }, 0),
    [shares, selectedIds],
  );

  useEffect(() => {
    setError(null);
  }, [amount, payerId, splitType, participants, shares, description]);

  function toggleParticipant(id: string) {
    setParticipants((p) => ({ ...p, [id]: !p[id] }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (submitting) return;
    if (!description.trim()) return setError("Add a short description");
    if (!amountNum || amountNum <= 0) return setError("Amount must be positive");
    if (!payerId) return setError("Select who paid");
    if (selectedIds.length === 0) return setError("Pick at least one participant");

    let splits: { member_id: string; amount: number }[];
    if (splitType === "equal") {
      splits = equalSplit;
    } else {
      splits = selectedIds.map((id) => ({
        member_id: id,
        amount: Number(shares[id]?.replace(/[, ]/g, "") ?? "0") || 0,
      }));
      const sum = splits.reduce((a, b) => a + b.amount, 0);
      if (Math.abs(sum - amountNum) > 0.01) {
        return setError(
          `Splits sum to ${formatINR(sum)}, expense is ${formatINR(amountNum)}.`,
        );
      }
    }

    setSubmitting(true);
    try {
      await onSubmit({
        payer_id: payerId,
        description: description.trim(),
        amount: amountNum,
        split_type: splitType,
        splits,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Couldn't save");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <Card>
        <p className="label mb-2">What was it for?</p>
        <input
          className="field"
          placeholder="Cab to airport"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          maxLength={64}
          autoFocus
        />

        <p className="label mt-5 mb-2">Amount</p>
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-muted">
            ₹
          </span>
          <input
            className="field pl-9 text-3xl font-display font-bold tabular-nums"
            inputMode="decimal"
            placeholder="0"
            value={amount}
            onChange={(e) => setAmount(e.target.value.replace(/[^\d.]/g, ""))}
          />
        </div>
      </Card>

      <Card>
        <p className="label mb-2">Paid by</p>
        <div className="flex flex-wrap gap-2">
          {members.map((m) => (
            <button
              type="button"
              key={m.id}
              onClick={() => setPayerId(m.id)}
              className={`inline-flex items-center gap-2 h-10 pl-1.5 pr-4 rounded-pill border transition no-tap-highlight ${
                payerId === m.id
                  ? "bg-mint text-bg border-mint"
                  : "bg-soft/60 text-ink-secondary border-white/[0.06]"
              }`}
            >
              <Avatar name={m.display_name} size="sm" />
              <span className="text-sm font-medium truncate max-w-[120px]">
                {m.display_name}
              </span>
            </button>
          ))}
        </div>
      </Card>

      <Card>
        <div className="flex items-center justify-between">
          <p className="label">Split between</p>
          <div className="inline-flex bg-soft/60 rounded-pill p-1">
            {(["equal", "unequal"] as SplitType[]).map((t) => (
              <button
                type="button"
                key={t}
                onClick={() => setSplitType(t)}
                className={`px-3 h-8 rounded-pill text-xs font-semibold capitalize ${
                  splitType === t
                    ? "bg-card text-ink-primary shadow-card"
                    : "text-ink-muted"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-4 space-y-2">
          {members.map((m) => {
            const selected = !!participants[m.id];
            const equalShare =
              equalSplit.find((s) => s.member_id === m.id)?.amount ?? 0;
            return (
              <div
                key={m.id}
                className={`flex items-center gap-3 rounded-input border px-3 py-2.5 transition ${
                  selected
                    ? "bg-soft/60 border-white/[0.06]"
                    : "bg-bg/40 border-white/[0.04] opacity-60"
                }`}
              >
                <button
                  type="button"
                  onClick={() => toggleParticipant(m.id)}
                  className={`h-6 w-6 rounded-md grid place-items-center transition ${
                    selected
                      ? "bg-mint text-bg"
                      : "bg-soft/80 text-transparent border border-white/10"
                  }`}
                  aria-label={selected ? "Remove" : "Add"}
                >
                  ✓
                </button>
                <Avatar name={m.display_name} size="sm" />
                <span className="flex-1 text-sm text-ink-primary truncate">
                  {m.display_name}
                </span>
                {selected && splitType === "equal" && (
                  <span className="text-sm font-semibold tabular-nums text-ink-secondary">
                    {formatINR(equalShare)}
                  </span>
                )}
                {selected && splitType === "unequal" && (
                  <div className="relative w-24">
                    <span className="absolute left-2 top-1/2 -translate-y-1/2 text-xs text-ink-muted">
                      ₹
                    </span>
                    <input
                      className="w-full bg-bg/60 border border-white/10 rounded-input pl-5 pr-2 h-9 text-right text-sm font-semibold tabular-nums outline-none focus:border-mint/50"
                      inputMode="decimal"
                      placeholder="0"
                      value={shares[m.id] ?? ""}
                      onChange={(e) =>
                        setShares((s) => ({
                          ...s,
                          [m.id]: e.target.value.replace(/[^\d.]/g, ""),
                        }))
                      }
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {splitType === "unequal" && (
          <div className="mt-4 flex items-center justify-between text-sm">
            <span className="text-ink-muted">Sum so far</span>
            <span
              className={`font-semibold tabular-nums ${
                Math.abs(unequalSum - amountNum) < 0.01
                  ? "text-mint"
                  : "text-gold"
              }`}
            >
              {formatINR(unequalSum)} / {formatINR(amountNum || 0)}
            </span>
          </div>
        )}
      </Card>

      {error && (
        <div className="rounded-input bg-danger-soft border border-danger/30 px-4 py-3 text-sm text-danger">
          {error}
        </div>
      )}

      <div className="space-y-3">
        <Button type="submit" full size="lg" loading={submitting}>
          {submitLabel}
        </Button>
        {onDelete && (
          <Button
            type="button"
            full
            variant="danger"
            onClick={() => {
              if (confirm("Delete this expense? Yeh permanent hai.")) onDelete();
            }}
          >
            Delete expense
          </Button>
        )}
      </div>
    </form>
  );
}

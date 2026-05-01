"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { AppShell } from "@/components/AppShell";
import { Button } from "@/components/Button";
import { Card } from "@/components/Card";
import { ToastProvider, useToast } from "@/components/Toast";
import {
  getIdentity,
  isValidPhone,
  normalizePhone,
  rememberTrip,
  setIdentity,
} from "@/lib/identity";
import { api } from "@/lib/api";
import type { Trip } from "@/types";

export default function JoinByCodePage() {
  return (
    <ToastProvider>
      <Inner />
    </ToastProvider>
  );
}

function Inner() {
  const params = useParams<{ code: string }>();
  const router = useRouter();
  const toast = useToast();
  const code = (params.code ?? "").toString().toUpperCase();

  const [trip, setTrip] = useState<Trip | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const id = getIdentity();
    if (id) {
      setName(id.name);
      setPhone(id.phone);
    }
    api
      .getTripByCode(code)
      .then((res) => setTrip(res.trip))
      .catch((e) => setError(e instanceof Error ? e.message : "Couldn't find that trip"))
      .finally(() => setLoading(false));
  }, [code]);

  const canSubmit =
    !!trip && name.trim().length >= 2 && isValidPhone(phone);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!trip || !canSubmit || submitting) return;
    setSubmitting(true);
    try {
      const normalized = normalizePhone(phone);
      const { member } = await api.joinTrip(trip.id, {
        phone: normalized,
        name: name.trim(),
      });
      setIdentity({
        user_id: member.user_id ?? "",
        phone: normalized,
        name: name.trim(),
      });
      rememberTrip({
        id: trip.id,
        name: trip.name,
        emoji: trip.emoji,
        invite_code: trip.invite_code,
      });
      toast.show(`Welcome to ${trip.name} 🎉`, "success");
      router.push(`/trip/${trip.id}`);
    } catch (err) {
      toast.show(err instanceof Error ? err.message : "Couldn't join", "error");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <AppShell title="Join trip" back="/">
      {loading ? (
        <Card>
          <div className="h-6 w-40 rounded bg-soft/70 animate-pulse" />
          <div className="h-12 w-full rounded bg-soft/70 mt-4 animate-pulse" />
        </Card>
      ) : error || !trip ? (
        <Card>
          <p className="font-display font-semibold text-ink-primary">
            Trip not found
          </p>
          <p className="text-sm text-ink-secondary mt-1">
            The invite code <span className="font-mono">{code}</span> doesn’t
            match any trip. Double check with whoever invited you.
          </p>
        </Card>
      ) : (
        <form onSubmit={onSubmit} className="space-y-5">
          <Card variant="mint" className="text-center">
            <div className="text-5xl">{trip.emoji || "🌴"}</div>
            <p className="mt-3 font-display font-bold text-2xl text-ink-primary">
              {trip.name}
            </p>
            <p className="text-xs text-mint mt-1 uppercase tracking-wider">
              code · {trip.invite_code}
            </p>
          </Card>

          <Card>
            <p className="label mb-2">Your name (as the group will see)</p>
            <input
              className="field"
              placeholder="Riya Mehta"
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={32}
            />

            <p className="label mb-2 mt-4">Phone number</p>
            <input
              className="field"
              inputMode="tel"
              placeholder="+91 98765 43210"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              maxLength={20}
            />
            {phone && !isValidPhone(phone) && (
              <p className="text-xs text-danger mt-1">
                Hmm, this doesn’t look like a valid number.
              </p>
            )}
          </Card>

          <Button
            type="submit"
            full
            size="lg"
            disabled={!canSubmit}
            loading={submitting}
          >
            Join the trip
          </Button>
        </form>
      )}
    </AppShell>
  );
}

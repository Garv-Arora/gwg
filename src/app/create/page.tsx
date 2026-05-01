"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AppShell } from "@/components/AppShell";
import { Button } from "@/components/Button";
import { Card } from "@/components/Card";
import {
  getIdentity,
  isValidPhone,
  normalizePhone,
  rememberTrip,
  setIdentity,
} from "@/lib/identity";
import { api } from "@/lib/api";
import { ToastProvider, useToast } from "@/components/Toast";

const EMOJIS = ["🌴", "🏔️", "🏖️", "🌃", "🎉", "🎒", "✈️", "🍻", "🚗", "🛕"];

export default function CreateTripPage() {
  return (
    <ToastProvider>
      <CreateTripInner />
    </ToastProvider>
  );
}

function CreateTripInner() {
  const router = useRouter();
  const toast = useToast();
  const [tripName, setTripName] = useState("");
  const [emoji, setEmoji] = useState(EMOJIS[0]);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const id = getIdentity();
    if (id) {
      setName(id.name);
      setPhone(id.phone);
    }
  }, []);

  const canSubmit =
    tripName.trim().length >= 2 &&
    name.trim().length >= 2 &&
    isValidPhone(phone);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit || submitting) return;
    setSubmitting(true);
    try {
      const normalized = normalizePhone(phone);
      const { trip, member } = await api.createTrip({
        name: tripName.trim(),
        emoji,
        creator: { phone: normalized, name: name.trim() },
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
      toast.show("Trip created — invite the gang!", "success");
      router.push(`/trip/${trip.id}?welcome=1`);
    } catch (err) {
      toast.show(err instanceof Error ? err.message : "Something went wrong", "error");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <AppShell title="New trip" back="/">
      <form onSubmit={onSubmit} className="space-y-5">
        <Card>
          <p className="label mb-2">Trip name</p>
          <input
            className="field text-lg font-medium"
            placeholder="Goa December 🏖️"
            value={tripName}
            onChange={(e) => setTripName(e.target.value)}
            maxLength={48}
            autoFocus
          />

          <div className="mt-5">
            <p className="label mb-2">Pick a vibe</p>
            <div className="flex flex-wrap gap-2">
              {EMOJIS.map((e) => (
                <button
                  type="button"
                  key={e}
                  onClick={() => setEmoji(e)}
                  className={`h-11 w-11 rounded-2xl text-xl grid place-items-center transition ${
                    emoji === e
                      ? "bg-mint text-bg shadow-glow"
                      : "bg-soft/60 hover:bg-soft text-ink-secondary"
                  }`}
                >
                  {e}
                </button>
              ))}
            </div>
          </div>
        </Card>

        <Card>
          <p className="text-sm text-ink-secondary">
            UdhariClub uses your phone as a soft identity — no OTP, nothing
            sent. Just so the same number across trips finds your name back.
          </p>
          <div className="mt-4 grid gap-3">
            <div>
              <p className="label mb-2">Your name</p>
              <input
                className="field"
                placeholder="Aarav Kapoor"
                value={name}
                onChange={(e) => setName(e.target.value)}
                maxLength={32}
              />
            </div>
            <div>
              <p className="label mb-2">Phone number</p>
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
            </div>
          </div>
        </Card>

        <div className="pt-2">
          <Button
            type="submit"
            full
            size="lg"
            disabled={!canSubmit}
            loading={submitting}
          >
            {submitting ? "Creating..." : "Create trip"}
          </Button>
          <p className="text-center mt-3 text-xs text-ink-muted">
            By continuing you agree to be the responsible adult of this trip.
          </p>
        </div>
      </form>
    </AppShell>
  );
}

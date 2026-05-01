"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { AppShell } from "@/components/AppShell";
import { Card, CardHeader } from "@/components/Card";
import { Button } from "@/components/Button";
import { Avatar } from "@/components/MemberChip";
import { EmptyState } from "@/components/EmptyState";
import { useTrip } from "@/components/TripContext";
import { useToast } from "@/components/Toast";
import { api } from "@/lib/api";
import { getIdentity, isValidPhone, normalizePhone } from "@/lib/identity";

export default function MembersPage() {
  const params = useParams<{ id: string }>();
  const tripId = (params.id ?? "").toString();
  const { state, refresh } = useTrip();
  const toast = useToast();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [adding, setAdding] = useState(false);

  if (state.status !== "ready") {
    return (
      <AppShell title="Members" back={`/trip/${tripId}`}>
        <div className="h-32 rounded-card bg-soft/30 animate-pulse" />
      </AppShell>
    );
  }

  const me = getIdentity();
  const myMemberId = me
    ? state.members.find((m) => m.phone === me.phone)?.id
    : null;

  const canAdd = name.trim().length >= 2 && (phone.trim() === "" || isValidPhone(phone));

  async function add(e: React.FormEvent) {
    e.preventDefault();
    if (!canAdd || adding) return;
    setAdding(true);
    try {
      await api.addMember(tripId, {
        display_name: name.trim(),
        phone: phone.trim() ? normalizePhone(phone) : undefined,
      });
      setName("");
      setPhone("");
      toast.show("Member added", "success");
      await refresh();
    } catch (err) {
      toast.show(err instanceof Error ? err.message : "Couldn't add", "error");
    } finally {
      setAdding(false);
    }
  }

  async function remove(memberId: string) {
    if (!confirm("Remove this member from trip?")) return;
    try {
      await api.removeMember(tripId, memberId);
      toast.show("Removed", "success");
      await refresh();
    } catch (err) {
      toast.show(err instanceof Error ? err.message : "Couldn't remove", "error");
    }
  }

  const inviteUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/join/${state.trip.invite_code}`
      : `/join/${state.trip.invite_code}`;
  const waText = `Aaja ${state.trip.name} pe! ${inviteUrl}`;

  return (
    <AppShell title="Members" back={`/trip/${tripId}`}>
      <Card variant="mint">
        <CardHeader
          title="Invite via link"
          subtitle="Easiest way — they'll join with their own phone."
        />
        <div className="rounded-input bg-bg/40 px-3 py-2 text-xs text-ink-secondary truncate">
          {inviteUrl}
        </div>
        <div className="mt-3 grid grid-cols-2 gap-2">
          <Button
            variant="secondary"
            onClick={async () => {
              try {
                await navigator.clipboard.writeText(inviteUrl);
                toast.show("Copied!", "success");
              } catch {
                toast.show("Couldn't copy", "error");
              }
            }}
          >
            Copy link
          </Button>
          <a
            href={`https://wa.me/?text=${encodeURIComponent(waText)}`}
            target="_blank"
            rel="noreferrer"
            className="h-11 inline-flex items-center justify-center rounded-pill bg-[#25D366] text-bg font-semibold"
          >
            WhatsApp
          </a>
        </div>
      </Card>

      <Card className="mt-4">
        <CardHeader
          title="Add manually"
          subtitle="For friends who won't use the link."
        />
        <form onSubmit={add} className="grid gap-3">
          <input
            className="field"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength={32}
          />
          <input
            className="field"
            inputMode="tel"
            placeholder="Phone (optional)"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            maxLength={20}
          />
          <Button type="submit" disabled={!canAdd} loading={adding} full>
            Add member
          </Button>
        </form>
      </Card>

      <div className="mt-6">
        <CardHeader title={`Group · ${state.members.length}`} />
        {state.members.length === 0 ? (
          <EmptyState emoji="👯" title="No one here yet" />
        ) : (
          <div className="space-y-2">
            {state.members.map((m) => (
              <Card
                key={m.id}
                variant="soft"
                className="flex items-center gap-3"
              >
                <Avatar name={m.display_name} size="md" />
                <div className="flex-1 min-w-0">
                  <p className="text-ink-primary font-medium truncate">
                    {m.display_name}
                    {m.id === myMemberId && (
                      <span className="ml-2 text-[10px] uppercase tracking-widest text-mint">
                        you
                      </span>
                    )}
                  </p>
                  {m.phone && (
                    <p className="text-xs text-ink-muted">{m.phone}</p>
                  )}
                </div>
                {m.id !== myMemberId && (
                  <button
                    onClick={() => remove(m.id)}
                    className="h-8 w-8 grid place-items-center rounded-full bg-danger-soft text-danger hover:bg-danger/30"
                    aria-label="Remove member"
                  >
                    ✕
                  </button>
                )}
              </Card>
            ))}
          </div>
        )}
      </div>
    </AppShell>
  );
}

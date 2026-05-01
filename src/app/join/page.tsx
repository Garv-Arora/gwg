"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AppShell } from "@/components/AppShell";
import { Button } from "@/components/Button";
import { Card } from "@/components/Card";
import { ToastProvider, useToast } from "@/components/Toast";

export default function JoinPage() {
  return (
    <ToastProvider>
      <JoinInner />
    </ToastProvider>
  );
}

function JoinInner() {
  const router = useRouter();
  const toast = useToast();
  const [code, setCode] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const normalized = code.trim().toUpperCase();
    if (normalized.length < 4) {
      toast.show("Code thoda short hai", "error");
      return;
    }
    setSubmitting(true);
    try {
      router.push(`/join/${normalized}`);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <AppShell title="Join a trip" back="/">
      <form onSubmit={onSubmit} className="space-y-5">
        <Card>
          <p className="label mb-2">Invite code</p>
          <input
            className="field text-2xl font-display font-bold tracking-[0.4em] uppercase text-center"
            placeholder="ABCD23"
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            maxLength={8}
            autoFocus
          />
          <p className="mt-3 text-xs text-ink-muted text-center">
            Ask the trip creator to share their invite link or code.
          </p>
        </Card>

        <Button
          type="submit"
          full
          size="lg"
          disabled={code.trim().length < 4}
          loading={submitting}
        >
          Continue
        </Button>
      </form>
    </AppShell>
  );
}

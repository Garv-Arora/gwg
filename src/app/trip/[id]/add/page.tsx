"use client";

import { useParams, useRouter } from "next/navigation";
import { AppShell } from "@/components/AppShell";
import { useTrip } from "@/components/TripContext";
import { useToast } from "@/components/Toast";
import { ExpenseForm } from "@/components/ExpenseForm";
import { EmptyState } from "@/components/EmptyState";
import { LinkButton } from "@/components/Button";
import { api } from "@/lib/api";
import { getIdentity } from "@/lib/identity";
import { useMemo } from "react";

export default function AddExpensePage() {
  const params = useParams<{ id: string }>();
  const tripId = (params.id ?? "").toString();
  const { state, refresh } = useTrip();
  const router = useRouter();
  const toast = useToast();

  const defaultPayerId = useMemo(() => {
    if (state.status !== "ready") return undefined;
    const me = getIdentity();
    if (me) {
      const found = state.members.find((m) => m.phone === me.phone);
      if (found) return found.id;
    }
    return state.members[0]?.id;
  }, [state]);

  if (state.status !== "ready") {
    return (
      <AppShell title="Add expense" back={`/trip/${tripId}`}>
        <div className="h-32 rounded-card bg-soft/30 animate-pulse" />
      </AppShell>
    );
  }

  if (state.members.length < 2) {
    return (
      <AppShell title="Add expense" back={`/trip/${tripId}`}>
        <EmptyState
          emoji="👯"
          title="Add at least one more member"
          body="Splitting alone is just spending. Invite the gang first."
          action={
            <LinkButton href={`/trip/${tripId}/members`} variant="primary">
              Manage members
            </LinkButton>
          }
        />
      </AppShell>
    );
  }

  return (
    <AppShell title="Add expense" back={`/trip/${tripId}`}>
      <ExpenseForm
        members={state.members}
        defaultPayerId={defaultPayerId}
        submitLabel="Save expense"
        onSubmit={async (input) => {
          await api.createExpense(tripId, input);
          toast.show("Expense added 💸", "success");
          await refresh();
          router.push(`/trip/${tripId}`);
        }}
      />
    </AppShell>
  );
}

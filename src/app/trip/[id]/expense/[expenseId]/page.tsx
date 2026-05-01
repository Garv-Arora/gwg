"use client";

import { useParams, useRouter } from "next/navigation";
import { AppShell } from "@/components/AppShell";
import { useTrip } from "@/components/TripContext";
import { useToast } from "@/components/Toast";
import { ExpenseForm } from "@/components/ExpenseForm";
import { EmptyState } from "@/components/EmptyState";
import { api } from "@/lib/api";

export default function EditExpensePage() {
  const params = useParams<{ id: string; expenseId: string }>();
  const tripId = (params.id ?? "").toString();
  const expenseId = (params.expenseId ?? "").toString();
  const { state, refresh } = useTrip();
  const router = useRouter();
  const toast = useToast();

  if (state.status !== "ready") {
    return (
      <AppShell title="Expense" back={`/trip/${tripId}`}>
        <div className="h-32 rounded-card bg-soft/30 animate-pulse" />
      </AppShell>
    );
  }

  const expense = state.expenses.find((e) => e.id === expenseId);

  if (!expense) {
    return (
      <AppShell title="Expense" back={`/trip/${tripId}`}>
        <EmptyState
          emoji="🤷"
          title="Expense not found"
          body="It might have been deleted by someone else."
        />
      </AppShell>
    );
  }

  return (
    <AppShell title="Edit expense" back={`/trip/${tripId}`}>
      <ExpenseForm
        members={state.members}
        initial={expense}
        submitLabel="Save changes"
        onSubmit={async (input) => {
          await api.updateExpense(expense.id, input);
          toast.show("Updated", "success");
          await refresh();
          router.push(`/trip/${tripId}`);
        }}
        onDelete={async () => {
          await api.deleteExpense(expense.id);
          toast.show("Deleted", "success");
          await refresh();
          router.push(`/trip/${tripId}`);
        }}
      />
    </AppShell>
  );
}

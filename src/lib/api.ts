"use client";

import type {
  Expense,
  ExpenseSplit,
  ExpenseWithSplits,
  Settlement,
  Trip,
  TripMember,
} from "@/types";

async function jsonFetch<T>(
  path: string,
  init?: RequestInit & { json?: unknown },
): Promise<T> {
  const opts: RequestInit = {
    method: init?.method ?? (init?.json ? "POST" : "GET"),
    headers: { "Content-Type": "application/json" },
    cache: "no-store",
    ...init,
  };
  if (init?.json !== undefined) opts.body = JSON.stringify(init.json);
  const res = await fetch(path, opts);
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(text || `Request failed: ${res.status}`);
  }
  return res.json() as Promise<T>;
}

export const api = {
  upsertUser: (input: { phone: string; name: string }) =>
    jsonFetch<{ user: { id: string; phone: string; name: string } }>(
      "/api/users",
      { json: input },
    ),

  createTrip: (input: { name: string; emoji: string; creator: { phone: string; name: string } }) =>
    jsonFetch<{ trip: Trip; member: TripMember }>("/api/trips", { json: input }),

  getTripByCode: (code: string) =>
    jsonFetch<{ trip: Trip }>(`/api/trips/by-code/${encodeURIComponent(code)}`),

  getTrip: (id: string) =>
    jsonFetch<{
      trip: Trip;
      members: TripMember[];
      expenses: ExpenseWithSplits[];
      settlements: Settlement[];
    }>(`/api/trips/${id}`),

  joinTrip: (id: string, input: { phone: string; name: string }) =>
    jsonFetch<{ member: TripMember }>(`/api/trips/${id}/join`, { json: input }),

  addMember: (tripId: string, input: { display_name: string; phone?: string }) =>
    jsonFetch<{ member: TripMember }>(`/api/trips/${tripId}/members`, {
      json: input,
    }),

  removeMember: (tripId: string, memberId: string) =>
    jsonFetch<{ ok: true }>(
      `/api/trips/${tripId}/members/${memberId}`,
      { method: "DELETE" },
    ),

  createExpense: (
    tripId: string,
    input: {
      payer_id: string;
      description: string;
      amount: number;
      split_type: "equal" | "unequal";
      splits: { member_id: string; amount: number }[];
    },
  ) =>
    jsonFetch<{ expense: Expense; splits: ExpenseSplit[] }>(
      `/api/trips/${tripId}/expenses`,
      { json: input },
    ),

  updateExpense: (
    expenseId: string,
    input: {
      payer_id: string;
      description: string;
      amount: number;
      split_type: "equal" | "unequal";
      splits: { member_id: string; amount: number }[];
    },
  ) =>
    jsonFetch<{ expense: Expense; splits: ExpenseSplit[] }>(
      `/api/expenses/${expenseId}`,
      { method: "PUT", json: input },
    ),

  deleteExpense: (expenseId: string) =>
    jsonFetch<{ ok: true }>(`/api/expenses/${expenseId}`, { method: "DELETE" }),

  createSettlement: (
    tripId: string,
    input: {
      from_member: string;
      to_member: string;
      amount: number;
      status?: "pending" | "settled";
    },
  ) =>
    jsonFetch<{ settlement: Settlement }>(
      `/api/trips/${tripId}/settlements`,
      { json: input },
    ),

  setSettlementStatus: (
    settlementId: string,
    status: "pending" | "settled",
  ) =>
    jsonFetch<{ settlement: Settlement }>(
      `/api/settlements/${settlementId}`,
      { method: "PUT", json: { status } },
    ),

  deleteSettlement: (settlementId: string) =>
    jsonFetch<{ ok: true }>(`/api/settlements/${settlementId}`, {
      method: "DELETE",
    }),
};

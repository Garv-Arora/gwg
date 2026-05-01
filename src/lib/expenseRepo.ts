import { supabaseServer } from "./supabase";

export type ExpenseInput = {
  payer_id: string;
  description: string;
  amount: number;
  split_type: "equal" | "unequal";
  splits: { member_id: string; amount: number }[];
};

const EPS = 0.01;

export function validateExpenseInput(input: ExpenseInput): string | null {
  if (!input.payer_id) return "Payer required";
  if (!input.description?.trim()) return "Description required";
  if (!Number.isFinite(input.amount) || input.amount <= 0)
    return "Amount must be positive";
  if (!Array.isArray(input.splits) || input.splits.length === 0)
    return "At least one participant required";
  for (const s of input.splits) {
    if (!s.member_id) return "Invalid split member";
    if (!Number.isFinite(s.amount) || s.amount < 0)
      return "Splits cannot be negative";
  }
  const sum = input.splits.reduce((a, b) => a + Number(b.amount), 0);
  if (Math.abs(sum - input.amount) > EPS)
    return `Splits must sum to total (${sum.toFixed(2)} ≠ ${input.amount.toFixed(2)})`;
  return null;
}

export async function insertExpenseWithSplits(
  tripId: string,
  input: ExpenseInput,
) {
  const sb = supabaseServer();
  const { data: expense, error: expErr } = await sb
    .from("expenses")
    .insert({
      trip_id: tripId,
      payer_id: input.payer_id,
      description: input.description.trim(),
      amount: input.amount,
      split_type: input.split_type,
    })
    .select("*")
    .single();
  if (expErr) throw expErr;

  const rows = input.splits.map((s) => ({
    expense_id: expense.id,
    member_id: s.member_id,
    amount: s.amount,
  }));
  const { data: splits, error: spErr } = await sb
    .from("expense_splits")
    .insert(rows)
    .select("*");
  if (spErr) throw spErr;

  return { expense, splits };
}

export async function replaceExpense(expenseId: string, input: ExpenseInput) {
  const sb = supabaseServer();

  const { data: expense, error: expErr } = await sb
    .from("expenses")
    .update({
      payer_id: input.payer_id,
      description: input.description.trim(),
      amount: input.amount,
      split_type: input.split_type,
    })
    .eq("id", expenseId)
    .select("*")
    .single();
  if (expErr) throw expErr;

  const { error: delErr } = await sb
    .from("expense_splits")
    .delete()
    .eq("expense_id", expenseId);
  if (delErr) throw delErr;

  const rows = input.splits.map((s) => ({
    expense_id: expenseId,
    member_id: s.member_id,
    amount: s.amount,
  }));
  const { data: splits, error: spErr } = await sb
    .from("expense_splits")
    .insert(rows)
    .select("*");
  if (spErr) throw spErr;

  return { expense, splits };
}

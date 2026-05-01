import { bad, db, fail, ok } from "@/lib/server";
import type { ExpenseWithSplits } from "@/types";

export const runtime = "nodejs";

export async function GET(_req: Request, ctx: { params: { id: string } }) {
  try {
    const tripId = ctx.params.id;
    if (!tripId) return bad("Trip id required");
    const sb = db();

    const [tripRes, membersRes, expensesRes, splitsRes, settlementsRes] =
      await Promise.all([
        sb.from("trips").select("*").eq("id", tripId).maybeSingle(),
        sb
          .from("trip_members")
          .select("*")
          .eq("trip_id", tripId)
          .order("joined_at", { ascending: true }),
        sb
          .from("expenses")
          .select("*")
          .eq("trip_id", tripId)
          .order("created_at", { ascending: false }),
        sb
          .from("expense_splits")
          .select("*, expenses!inner(trip_id)")
          .eq("expenses.trip_id", tripId),
        sb
          .from("settlements")
          .select("*")
          .eq("trip_id", tripId)
          .order("created_at", { ascending: false }),
      ]);

    if (tripRes.error) throw tripRes.error;
    if (!tripRes.data) return bad("Trip not found", 404);
    if (membersRes.error) throw membersRes.error;
    if (expensesRes.error) throw expensesRes.error;
    if (splitsRes.error) throw splitsRes.error;
    if (settlementsRes.error) throw settlementsRes.error;

    const splitsByExp = new Map<string, ExpenseWithSplits["splits"]>();
    for (const row of (splitsRes.data ?? []) as Array<{
      id: string;
      expense_id: string;
      member_id: string;
      amount: number;
    }>) {
      const list = splitsByExp.get(row.expense_id) ?? [];
      list.push({
        id: row.id,
        expense_id: row.expense_id,
        member_id: row.member_id,
        amount: Number(row.amount),
      });
      splitsByExp.set(row.expense_id, list);
    }

    const expenses: ExpenseWithSplits[] = (expensesRes.data ?? []).map((e) => ({
      ...e,
      amount: Number(e.amount),
      splits: splitsByExp.get(e.id) ?? [],
    }));

    return ok({
      trip: tripRes.data,
      members: membersRes.data ?? [],
      expenses,
      settlements: (settlementsRes.data ?? []).map((s) => ({
        ...s,
        amount: Number(s.amount),
      })),
    });
  } catch (e) {
    return fail(e);
  }
}

export async function DELETE(
  _req: Request,
  ctx: { params: { id: string } },
) {
  try {
    const tripId = ctx.params.id;
    if (!tripId) return bad("Trip id required");
    const sb = db();
    const { error } = await sb.from("trips").delete().eq("id", tripId);
    if (error) throw error;
    return ok({ ok: true });
  } catch (e) {
    return fail(e);
  }
}

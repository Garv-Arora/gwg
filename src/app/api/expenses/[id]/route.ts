import { bad, db, fail, ok } from "@/lib/server";
import {
  replaceExpense,
  validateExpenseInput,
  type ExpenseInput,
} from "@/lib/expenseRepo";

export const runtime = "nodejs";

export async function PUT(req: Request, ctx: { params: { id: string } }) {
  try {
    const id = ctx.params.id;
    if (!id) return bad("Expense id required");
    const body = (await req.json()) as ExpenseInput;
    const err = validateExpenseInput(body);
    if (err) return bad(err);
    const result = await replaceExpense(id, body);
    return ok(result);
  } catch (e) {
    return fail(e);
  }
}

export async function DELETE(_req: Request, ctx: { params: { id: string } }) {
  try {
    const id = ctx.params.id;
    if (!id) return bad("Expense id required");
    const sb = db();
    const { error } = await sb.from("expenses").delete().eq("id", id);
    if (error) throw error;
    return ok({ ok: true });
  } catch (e) {
    return fail(e);
  }
}

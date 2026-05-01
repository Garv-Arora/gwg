import { bad, fail, ok } from "@/lib/server";
import {
  insertExpenseWithSplits,
  validateExpenseInput,
  type ExpenseInput,
} from "@/lib/expenseRepo";

export const runtime = "nodejs";

export async function POST(req: Request, ctx: { params: { id: string } }) {
  try {
    const tripId = ctx.params.id;
    if (!tripId) return bad("Trip id required");
    const body = (await req.json()) as ExpenseInput;
    const err = validateExpenseInput(body);
    if (err) return bad(err);
    const result = await insertExpenseWithSplits(tripId, body);
    return ok(result);
  } catch (e) {
    return fail(e);
  }
}

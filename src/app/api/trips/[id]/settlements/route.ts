import { bad, db, fail, ok } from "@/lib/server";

export const runtime = "nodejs";

export async function POST(req: Request, ctx: { params: { id: string } }) {
  try {
    const tripId = ctx.params.id;
    const { from_member, to_member, amount, status } = await req.json();
    if (!tripId) return bad("Trip id required");
    if (!from_member || !to_member) return bad("from and to required");
    if (from_member === to_member) return bad("from and to must differ");
    if (!Number.isFinite(amount) || Number(amount) <= 0)
      return bad("Amount must be positive");

    const sb = db();
    const { data, error } = await sb
      .from("settlements")
      .insert({
        trip_id: tripId,
        from_member,
        to_member,
        amount: Number(amount),
        status: status === "settled" ? "settled" : "pending",
        settled_at: status === "settled" ? new Date().toISOString() : null,
      })
      .select("*")
      .single();
    if (error) throw error;
    return ok({ settlement: data });
  } catch (e) {
    return fail(e);
  }
}

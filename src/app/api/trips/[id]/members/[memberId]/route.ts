import { bad, db, fail, ok } from "@/lib/server";

export const runtime = "nodejs";

export async function DELETE(
  _req: Request,
  ctx: { params: { id: string; memberId: string } },
) {
  try {
    const { id: tripId, memberId } = ctx.params;
    if (!tripId || !memberId) return bad("Missing ids");
    const sb = db();

    // Refuse to delete a member who already participates in any expense or
    // settlement — deleting them would silently rewrite history.
    const [{ data: paid }, { data: split }, { data: settled }] = await Promise.all([
      sb.from("expenses").select("id").eq("payer_id", memberId).limit(1),
      sb.from("expense_splits").select("id").eq("member_id", memberId).limit(1),
      sb
        .from("settlements")
        .select("id")
        .or(`from_member.eq.${memberId},to_member.eq.${memberId}`)
        .limit(1),
    ]);
    if ((paid && paid.length) || (split && split.length) || (settled && settled.length)) {
      return bad(
        "Member ke expenses/settlements already hain. Pehle unhe delete karo, phir member hatao.",
      );
    }

    const { error } = await sb
      .from("trip_members")
      .delete()
      .eq("id", memberId)
      .eq("trip_id", tripId);
    if (error) throw error;
    return ok({ ok: true });
  } catch (e) {
    return fail(e);
  }
}

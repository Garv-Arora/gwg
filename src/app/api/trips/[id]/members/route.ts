import { bad, db, fail, ok } from "@/lib/server";

export const runtime = "nodejs";

export async function POST(req: Request, ctx: { params: { id: string } }) {
  try {
    const tripId = ctx.params.id;
    const body = await req.json();
    const display_name = String(body?.display_name ?? "").trim();
    const phone = body?.phone ? String(body.phone).trim() : null;

    if (!tripId) return bad("Trip id required");
    if (!display_name) return bad("Member name required");

    const sb = db();

    const { data: clash } = await sb
      .from("trip_members")
      .select("id")
      .eq("trip_id", tripId)
      .eq("display_name", display_name)
      .maybeSingle();
    if (clash) return bad("Yeh naam already group mein hai. Try a different one.");

    const { data: member, error } = await sb
      .from("trip_members")
      .insert({ trip_id: tripId, display_name, phone })
      .select("*")
      .single();
    if (error) throw error;
    return ok({ member });
  } catch (e) {
    return fail(e);
  }
}

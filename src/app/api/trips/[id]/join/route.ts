import { bad, db, fail, ok } from "@/lib/server";
import { upsertUserByPhone } from "@/lib/userRepo";

export const runtime = "nodejs";

export async function POST(req: Request, ctx: { params: { id: string } }) {
  try {
    const tripId = ctx.params.id;
    const { phone, name } = await req.json();
    if (!tripId) return bad("Trip id required");
    if (!phone || !name) return bad("phone and name are required");

    const sb = db();
    const { data: trip, error: tripErr } = await sb
      .from("trips")
      .select("id")
      .eq("id", tripId)
      .maybeSingle();
    if (tripErr) throw tripErr;
    if (!trip) return bad("Trip not found", 404);

    const user = await upsertUserByPhone(String(phone).trim(), String(name).trim());

    const { data: existing } = await sb
      .from("trip_members")
      .select("*")
      .eq("trip_id", tripId)
      .eq("user_id", user.id)
      .maybeSingle();

    if (existing) {
      return ok({ member: existing });
    }

    let display = user.name;
    let suffix = 1;
    while (true) {
      const { data: clash } = await sb
        .from("trip_members")
        .select("id")
        .eq("trip_id", tripId)
        .eq("display_name", display)
        .maybeSingle();
      if (!clash) break;
      suffix += 1;
      display = `${user.name} ${suffix}`;
      if (suffix > 50) break;
    }

    const { data: member, error: memErr } = await sb
      .from("trip_members")
      .insert({
        trip_id: tripId,
        user_id: user.id,
        display_name: display,
        phone: user.phone,
      })
      .select("*")
      .single();
    if (memErr) throw memErr;

    return ok({ member });
  } catch (e) {
    return fail(e);
  }
}

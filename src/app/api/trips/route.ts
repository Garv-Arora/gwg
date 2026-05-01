import { bad, db, fail, generateInviteCode, ok } from "@/lib/server";
import { upsertUserByPhone } from "@/lib/userRepo";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const name = String(body?.name ?? "").trim();
    const emoji = String(body?.emoji ?? "🌴").slice(0, 4);
    const phone = String(body?.creator?.phone ?? "").trim();
    const creatorName = String(body?.creator?.name ?? "").trim();

    if (!name) return bad("Trip name is required");
    if (!phone || !creatorName) return bad("Creator phone and name required");

    const user = await upsertUserByPhone(phone, creatorName);

    const sb = db();

    let invite_code = generateInviteCode();
    // Loop a few times in the unlikely case of a collision.
    for (let i = 0; i < 5; i++) {
      const { data: clash } = await sb
        .from("trips")
        .select("id")
        .eq("invite_code", invite_code)
        .maybeSingle();
      if (!clash) break;
      invite_code = generateInviteCode();
    }

    const { data: trip, error: tripErr } = await sb
      .from("trips")
      .insert({ name, emoji, invite_code, created_by: user.id })
      .select("*")
      .single();
    if (tripErr) throw tripErr;

    const { data: member, error: memErr } = await sb
      .from("trip_members")
      .insert({
        trip_id: trip.id,
        user_id: user.id,
        display_name: user.name,
        phone: user.phone,
      })
      .select("*")
      .single();
    if (memErr) throw memErr;

    return ok({ trip, member });
  } catch (e) {
    return fail(e);
  }
}

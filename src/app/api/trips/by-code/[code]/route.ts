import { bad, db, fail, ok } from "@/lib/server";

export const runtime = "nodejs";

export async function GET(
  _req: Request,
  ctx: { params: { code: string } },
) {
  try {
    const code = ctx.params.code?.toUpperCase();
    if (!code) return bad("Invite code required");
    const sb = db();
    const { data: trip, error } = await sb
      .from("trips")
      .select("*")
      .eq("invite_code", code)
      .maybeSingle();
    if (error) throw error;
    if (!trip) return bad("Trip not found", 404);
    return ok({ trip });
  } catch (e) {
    return fail(e);
  }
}

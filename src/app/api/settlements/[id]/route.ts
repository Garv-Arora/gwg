import { bad, db, fail, ok } from "@/lib/server";

export const runtime = "nodejs";

export async function PUT(req: Request, ctx: { params: { id: string } }) {
  try {
    const id = ctx.params.id;
    const { status } = await req.json();
    if (!id) return bad("Settlement id required");
    if (status !== "pending" && status !== "settled")
      return bad("Invalid status");

    const sb = db();
    const { data, error } = await sb
      .from("settlements")
      .update({
        status,
        settled_at: status === "settled" ? new Date().toISOString() : null,
      })
      .eq("id", id)
      .select("*")
      .single();
    if (error) throw error;
    return ok({ settlement: data });
  } catch (e) {
    return fail(e);
  }
}

export async function DELETE(_req: Request, ctx: { params: { id: string } }) {
  try {
    const id = ctx.params.id;
    if (!id) return bad("Settlement id required");
    const sb = db();
    const { error } = await sb.from("settlements").delete().eq("id", id);
    if (error) throw error;
    return ok({ ok: true });
  } catch (e) {
    return fail(e);
  }
}

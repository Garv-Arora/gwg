import { supabaseServer } from "./supabase";

export type UserRow = {
  id: string;
  phone: string;
  name: string;
  created_at: string;
};

/**
 * Look up user by phone or create one if missing. If a user exists with the
 * same phone but a different name, update their name to the latest provided.
 */
export async function upsertUserByPhone(
  phone: string,
  name: string,
): Promise<UserRow> {
  const sb = supabaseServer();

  const { data: existing, error: selErr } = await sb
    .from("users")
    .select("*")
    .eq("phone", phone)
    .maybeSingle();

  if (selErr) throw selErr;

  if (existing) {
    if (existing.name !== name) {
      const { data: updated, error: upErr } = await sb
        .from("users")
        .update({ name })
        .eq("id", existing.id)
        .select("*")
        .single();
      if (upErr) throw upErr;
      return updated as UserRow;
    }
    return existing as UserRow;
  }

  const { data: inserted, error: insErr } = await sb
    .from("users")
    .insert({ phone, name })
    .select("*")
    .single();

  if (insErr) throw insErr;
  return inserted as UserRow;
}

import { bad, fail, ok } from "@/lib/server";
import { upsertUserByPhone } from "@/lib/userRepo";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const { phone, name } = await req.json();
    if (!phone || !name) return bad("phone and name are required");
    const user = await upsertUserByPhone(String(phone).trim(), String(name).trim());
    return ok({ user });
  } catch (e) {
    return fail(e);
  }
}

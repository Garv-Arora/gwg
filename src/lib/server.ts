import { NextResponse } from "next/server";
import { supabaseServer } from "./supabase";

export function ok<T>(data: T, status = 200) {
  return NextResponse.json(data, { status });
}

export function bad(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status });
}

export function fail(e: unknown, status = 500) {
  const msg = e instanceof Error ? e.message : "Unknown error";
  return NextResponse.json({ error: msg }, { status });
}

export function db() {
  return supabaseServer();
}

export function nowIso() {
  return new Date().toISOString();
}

const EMOJI = "🌴";

export function generateInviteCode(): string {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let s = "";
  for (let i = 0; i < 6; i++) {
    s += alphabet[Math.floor(Math.random() * alphabet.length)];
  }
  return s;
}

export const DEFAULTS = { EMOJI };

import { NextResponse } from "next/server";

export async function POST(): Promise<NextResponse> {
  const BACKEND_URL = process.env.BACKEND_URL;

  // Attempt to inform backend if available (best-effort)
  if (BACKEND_URL) {
    try {
      await fetch(`${BACKEND_URL}/auth/logout`, { method: "POST" });
    } catch {
      // ignore backend logout errors
    }
  }

  const res = NextResponse.json({ ok: true });

  // Clear cookie
  res.cookies.set({ name: "token", value: "", httpOnly: true, path: "/", maxAge: 0 });

  return res;
}

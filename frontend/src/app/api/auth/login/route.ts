import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const BACKEND_URL = process.env.BACKEND_URL;
  if (!BACKEND_URL) {
    return NextResponse.json({ error: "BACKEND_URL not configured" }, { status: 500 });
  }

  const body = await request.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const backendRes = await fetch(`${BACKEND_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const data = await backendRes.json().catch(() => ({}));

  if (!backendRes.ok) {
    return NextResponse.json({ error: data?.message || "Login failed" }, { status: backendRes.status });
  }

  const token = data?.token;
  if (!token) {
    return NextResponse.json({ error: "No token returned from backend" }, { status: 502 });
  }

  const maxAge = 7 * 24 * 60 * 60; // 7 days
  const res = NextResponse.json({ ok: true, user: data.user ?? null });

  res.cookies.set({
    name: "token",
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge,
  });

  return res;
}

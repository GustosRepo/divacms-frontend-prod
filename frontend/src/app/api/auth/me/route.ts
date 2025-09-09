import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const BACKEND_URL = process.env.BACKEND_URL;
  if (!BACKEND_URL) {
    return NextResponse.json({ error: "BACKEND_URL not configured" }, { status: 500 });
  }

  const cookieHeader = request.headers.get("cookie") || "";
  const tokenMatch = /(?:^|; )token=([^;]+)/.exec(cookieHeader);
  const token = tokenMatch ? decodeURIComponent(tokenMatch[1]) : null;

  const headers: Record<string, string> = {};
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const backendRes = await fetch(`${BACKEND_URL}/auth/me`, {
    method: "GET",
    headers,
  });

  const data = await backendRes.json().catch(() => ({}));
  if (!backendRes.ok) {
    return NextResponse.json({ error: data?.message || "Failed to fetch user" }, { status: backendRes.status });
  }

  return NextResponse.json({ user: data.user ?? data });
}

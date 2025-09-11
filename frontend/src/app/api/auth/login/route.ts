import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const BACKEND_URL = process.env.BACKEND_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
  
  console.log("Login attempt - Backend URL:", BACKEND_URL);
  
  if (!BACKEND_URL) {
    console.error("BACKEND_URL not configured");
    return NextResponse.json({ error: "BACKEND_URL not configured" }, { status: 500 });
  }

  let body;
  try {
    body = await request.json();
  } catch (error) {
    console.error("Invalid JSON in login request:", error);
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  try {
    console.log("Forwarding login request to:", `${BACKEND_URL}/auth/login`);
    
    const backendRes = await fetch(`${BACKEND_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    console.log("Backend response status:", backendRes.status);
    
    const data = await backendRes.json().catch((error) => {
      console.error("Failed to parse backend response as JSON:", error);
      return { message: "Backend returned invalid JSON" };
    });

    if (!backendRes.ok) {
      console.error("Backend login failed:", backendRes.status, data);
      return NextResponse.json({ error: data?.message || "Login failed" }, { status: backendRes.status });
    }

    const token = data?.token;
    if (!token) {
      console.error("No token returned from backend:", data);
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

    console.log("Login successful for user:", data.user?.email);
    return res;
  } catch (error) {
    console.error("Login route error:", error);
    return NextResponse.json({ 
      error: "Internal server error", 
      details: error instanceof Error ? error.message : "Unknown error" 
    }, { status: 500 });
  }
}

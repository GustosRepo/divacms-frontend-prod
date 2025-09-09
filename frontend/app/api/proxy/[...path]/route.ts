import { NextResponse } from "next/server";

const BACKEND_URL = process.env.BACKEND_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

function getCookieToken(cookieHeader: string | null) {
  if (!cookieHeader) return null;
  const match = cookieHeader.match(/(?:^|; )token=([^;]+)/);
  return match ? decodeURIComponent(match[1]) : null;
}

async function forward(request: Request, params: { path?: string[] }) {
  try {
    const path = params?.path ? '/' + params.path.join('/') : '';
    const urlObj = new URL(request.url);
    const search = urlObj.search || '';
    const target = BACKEND_URL.replace(/\/+$|\s+/g, '') + path + search;

    const headers = new Headers();
    // copy incoming headers except host
    for (const [k, v] of request.headers) {
      if (k.toLowerCase() === 'host') continue;
      headers.set(k, v);
    }

    // If an HttpOnly `token` cookie exists, attach Authorization when forwarding
    const cookieHeader = request.headers.get('cookie');
    const token = getCookieToken(cookieHeader);
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }

    // Prepare body if present
    let body: BodyInit | undefined = undefined;
    if (request.method !== 'GET' && request.method !== 'HEAD') {
      const buf = await request.arrayBuffer();
      body = buf.byteLength ? Buffer.from(buf) : undefined;
    }

    const res = await fetch(target, {
      method: request.method,
      headers,
      body,
      redirect: 'manual',
    });

    // Copy response headers, but avoid forwarding backend-set cookies directly
    const responseHeaders: Record<string, string> = {};
    res.headers.forEach((value, key) => {
      if (key.toLowerCase() === 'set-cookie') return;
      if (key.toLowerCase() === 'transfer-encoding') return;
      responseHeaders[key] = value;
    });

    const arrayBuffer = await res.arrayBuffer();
    return new Response(arrayBuffer, { status: res.status, headers: responseHeaders });
  } catch (err) {
    console.error('Proxy error:', err);
    return NextResponse.json({ error: 'Proxy error' }, { status: 500 });
  }
}

function extractParams(ctx: unknown): { path?: string[] } {
  const asObj = ctx as { params?: { path?: string[] } } | undefined;
  return (asObj && asObj.params) ? asObj.params : {};
}

export async function GET(request: Request, context: unknown) {
  return forward(request, extractParams(context));
}

export async function POST(request: Request, context: unknown) {
  return forward(request, extractParams(context));
}

export async function PUT(request: Request, context: unknown) {
  return forward(request, extractParams(context));
}

export async function PATCH(request: Request, context: unknown) {
  return forward(request, extractParams(context));
}

export async function DELETE(request: Request, context: unknown) {
  return forward(request, extractParams(context));
}

export async function OPTIONS(request: Request, context: unknown) {
  return forward(request, extractParams(context));
}

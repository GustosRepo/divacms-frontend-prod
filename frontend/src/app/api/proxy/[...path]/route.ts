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
    for (const [k, v] of request.headers) {
      if (k.toLowerCase() === 'host') continue;
      headers.set(k, v as string);
    }

    const cookieHeader = request.headers.get('cookie');
    const token = getCookieToken(cookieHeader);
    if (token) headers.set('Authorization', `Bearer ${token}`);

    let body: BodyInit | undefined = undefined;
    if (request.method !== 'GET' && request.method !== 'HEAD') {
      const buf = await request.arrayBuffer();
      body = buf.byteLength ? Buffer.from(buf) : undefined;
    }

    const res = await fetch(target, { method: request.method, headers, body, redirect: 'manual' });

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

async function extractParams(ctx: unknown): Promise<{ path?: string[] }> {
  const asObj = ctx as { params?: unknown } | undefined;
  const maybeParams = asObj?.params;
  if (!maybeParams) return {};
  // params may be a Promise in newer Next versions; await if needed
  const resolved = (typeof (maybeParams as any)?.then === 'function') ? await (maybeParams as any) : maybeParams;
  return resolved as { path?: string[] };
}

export async function GET(request: Request, context: unknown) {
  const params = await extractParams(context);
  return forward(request, params);
}

export async function POST(request: Request, context: unknown) {
  const params = await extractParams(context);
  return forward(request, params);
}

export async function PUT(request: Request, context: unknown) {
  const params = await extractParams(context);
  return forward(request, params);
}

export async function PATCH(request: Request, context: unknown) {
  const params = await extractParams(context);
  return forward(request, params);
}

export async function DELETE(request: Request, context: unknown) {
  const params = await extractParams(context);
  return forward(request, params);
}

export async function OPTIONS(request: Request, context: unknown) {
  const params = await extractParams(context);
  return forward(request, params);
}

// Use same-origin proxy so server can attach Authorization from HttpOnly cookie
function proxyUrlFor(path: string) {
  // Pass through absolute URLs
  if (path?.startsWith('http://') || path?.startsWith('https://')) return path;
  // Avoid double prefix if caller already used the proxy path
  if (path?.startsWith('/api/proxy/')) return path;
  const p = (path || '').replace(/^\/+/, '');
  return `/api/proxy/${p}`;
}

async function safeFetch(path: string, init: RequestInit = {}) {
  const url = proxyUrlFor(path);
  const opts: RequestInit = {
    credentials: "include",
    headers: { "Content-Type": "application/json", ...(init.headers || {}) },
    ...init,
  };

  const res = await fetch(url, opts);

  const ct = res.headers.get("content-type") || "";
  const isJSON = ct.includes("application/json");

  if (!res.ok) {
    let bodyText = "";
    try {
      bodyText = isJSON ? JSON.stringify(await res.json()) : await res.text();
    } catch {
      // ignore parse errors
    }
    console.error("API error", res.status, bodyText || res.statusText);
    const err = new Error(`API ${res.status}: ${url}${bodyText ? " — " + bodyText : ""}`);
    // @ts-expect-error attach extra info
    err.status = res.status;
  // @ts-expect-error: attach extra info to error object
    err.body = bodyText;
    throw err;
  }

  if (!isJSON) {
    const text = await res.text();
    console.error("Non-JSON response:", text);
    throw new Error(`Expected JSON at ${url} but got ${ct}`);
  }

  return res.json();
}

export { safeFetch };

export const fetchProducts = () => safeFetch("/products");

export const fetchCategories = () => safeFetch("/admin/categories");

export const login = async (email: string, password: string) => {
  // Use same-origin proxy so cookie is set on frontend domain
  const res = await fetch("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ email, password }),
  });
  
  // Check if response is valid JSON
  const contentType = res.headers.get("content-type");
  if (!contentType?.includes("application/json")) {
    const text = await res.text();
    console.error("Non-JSON login response:", text);
    throw new Error("Server error - invalid response format");
  }
  
  const data = await res.json().catch((error) => {
    console.error("Failed to parse login response as JSON:", error);
    throw new Error("Server error - invalid JSON response");
  });
  
  if (!res.ok) throw new Error(data?.error || `Login failed (${res.status})`);
  return data;
};

export const fetchMe = async () => {
  const res = await fetch("/api/auth/me", { credentials: "include" });
  if (!res.ok) return null;
  const data = await res.json();
  return data?.user ?? null;
};
// Use same-origin proxy so server can attach Authorization from HttpOnly cookie
function proxyUrlFor(path: string) {
  const p = path.replace(/^\/+/, "");
  return `/api/proxy/${p}`;
}

async function safeFetch(path: string, init: RequestInit = {}) {
  const url = proxyUrlFor(path);
  const mergedInit: RequestInit = { credentials: "include", ...init };
  const res = await fetch(url, mergedInit);

  const ct = res.headers.get("content-type") || "";
  if (!res.ok) {
    const text = await res.text();
    console.error("API error", res.status, text);
    throw new Error(`API ${res.status}: ${url}`);
  }
  if (!ct.includes("application/json")) {
    const text = await res.text();
    console.error("Non-JSON response:", text);
    throw new Error(`Expected JSON at ${url} but got ${ct}`);
  }
  return res.json();
}

export const fetchProducts = () => safeFetch("/products");

export const fetchCategories = () => safeFetch("/categories");

export const login = async (email: string, password: string) => {
  // Use same-origin proxy so cookie is set on frontend domain
  const res = await fetch("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ email, password }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data?.error || "Login failed");
  return data;
};

export const fetchMe = async () => {
  const res = await fetch("/api/auth/me", { credentials: "include" });
  if (!res.ok) return null;
  const data = await res.json();
  return data?.user ?? null;
};
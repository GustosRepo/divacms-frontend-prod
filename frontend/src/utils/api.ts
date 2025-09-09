const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

function joinUrl(base: string, path: string) {
  const b = base.replace(/\/+$/, "");
  const p = path.replace(/^\/+/, "");
  return `${b}/${p}`;
}

async function safeFetch(path: string, init: RequestInit = {}) {
  const url = joinUrl(API_BASE_URL, path);
  const res = await fetch(url, init);

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

export const login = (email: string, password: string) =>
  safeFetch("/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
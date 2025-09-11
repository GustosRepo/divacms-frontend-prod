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
  const mergedInit: RequestInit = { credentials: "include", ...init };
  const res = await fetch(url, mergedInit);

  const ct = res.headers.get("content-type") || "";
  if (!res.ok) {
    const text = await res.text();
    
    // Don't log certain expected 404s that are handled gracefully by components
    const is404 = res.status === 404;
    const isExpected404 = is404 && (
      text.includes("No orders found") || 
      text.includes("User not found") ||
      path.includes("/orders/my-orders") ||
      path.includes("/users/")
    );
    
    if (!isExpected404) {
      console.error("API error", res.status, text);
    }
    
    throw new Error(`API ${res.status}: ${url}`);
  }
  if (!ct.includes("application/json")) {
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
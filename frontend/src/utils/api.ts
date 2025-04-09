const API_BASE_URL = "http://localhost:3001"; // Update when deploying

export const fetchProducts = async () => {
  const res = await fetch(`${API_BASE_URL}/products`);
  return res.json();
};

export const fetchCategories = async () => {
  const res = await fetch(`${API_BASE_URL}/categories`);
  return res.json();
};

export const login = async (email: string, password: string) => {
  const res = await fetch(`${API_BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  return res.json();
};
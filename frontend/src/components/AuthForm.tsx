"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext"; // ✅ Use AuthContext

export default function AuthForm({ isLogin = true }) {
  const router = useRouter();
  const { login } = useAuth(); // ✅ Get login from AuthContext
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (isLogin) {
        await login(formData.email, formData.password); // ✅ Use AuthContext login function
      } else {
        // Handle register separately (existing API call)
        const response = await fetch(`/api/proxy/auth/register`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: 'include',
          body: JSON.stringify(formData),
        });

        if (!response.ok) {
          const message = await response.text();
          throw new Error(message || "Signup failed.");
        }

        const userData = await response.json(); // Get user data from response
        if (userData.isAdmin) {
          router.push("/admin");
        } else {
          router.push("/dashboard");
        }
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : "Something went wrong.");
    }

    setLoading(false);
  };

  return (
    <div className="container mx-auto px-6 py-10">
            <h1 className="font-shuneva text-3xl font-bold text-center">
        {isLogin ? "Welcome Back!" : "Join Diva Factory"}
      </h1>

      <form
        onSubmit={handleSubmit}
        className="max-w-md mx-auto mt-6 bg-black/20 p-6 rounded-lg shadow-lg"
      >
        {!isLogin && (
          <div>
            <label className="block mb-2">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full p-2 mb-4 text-black rounded-lg"
            />
          </div>
        )}

        <label className="block mb-2">Email</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
          className="w-full p-2 mb-4 text-black rounded-lg"
        />

        <label className="block mb-2">Password</label>
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          required
          className="w-full p-2 mb-4 text-black rounded-lg"
        />

        {error && <p className="text-red-500 text-center">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="mt-4 bg-pink-500 hover:bg-pink-700 text-white px-6 py-3 rounded-lg text-lg shadow-md transition transform hover:scale-105 w-full"
        >
          {loading ? "Processing..." : isLogin ? "Log In" : "Sign Up"}
        </button>
      </form>

      <div className="text-center mt-4">
        <p>
          {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
          <a href={isLogin ? "/register" : "/login"} className="text-pink-400 underline">
            {isLogin ? "Sign up" : "Log in"}
          </a>
        </p>
      </div>
    </div>
  );
}

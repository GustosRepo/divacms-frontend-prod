"use client";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";

export default function RegisterPage() {
  const { login } = useAuth();
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
      const response = await fetch("${process.env.NEXT_PUBLIC_API_URL}/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const message = await response.text();
        throw new Error(message || "Signup failed.");
      }

      // Auto-login after successful registration
      await login(formData.email, formData.password);
    } catch (error) {
      setError(error instanceof Error ? error.message : "Something went wrong.");
    }

    setLoading(false);
  };

  return (
    <div className="container mx-auto px-6 py-10 text-white">
      <h1 className="text-3xl font-bold text-center">📝 Create Account</h1>

      <form onSubmit={handleSubmit} className="max-w-lg mx-auto mt-6 bg-black/20 p-6 rounded-lg">
        <label className="block mb-2">Full Name</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          className="w-full p-2 mb-4 text-black rounded-lg"
        />

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
          className="mt-6 bg-pink-500 hover:bg-pink-700 text-white px-6 py-3 rounded-lg text-lg shadow-md w-full"
        >
          {loading ? "Processing..." : "Sign Up"}
        </button>
      </form>

      {/* ✅ Add Login Link */}
      <div className="text-center mt-4">
        <p>
          Already have an account?{" "}
          <Link href="/login" className="text-pink-400 underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}
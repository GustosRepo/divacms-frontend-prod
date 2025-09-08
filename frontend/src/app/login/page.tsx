"use client";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link"; // ✅ Import Link for navigation

export default function LoginPage() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await login(email, password);
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="w-full max-w-md p-8 bg-black/20 rounded-lg">
        <h1 className="text-3xl font-bold text-center">🔐 Login</h1>

        <form onSubmit={handleSubmit} className="mt-6">
          <label className="block mb-2">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full p-2 mb-4 text-black rounded-lg"
          />

          <label className="block mb-2">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full p-2 mb-4 text-black rounded-lg"
          />

          <button type="submit" className="mt-6 bg-pink-500 hover:bg-pink-700 text-white px-6 py-3 rounded-lg text-lg shadow-md w-full">
            Log In
          </button>
        </form>

        {/* ✅ Add Sign Up Link */}
        <div className="text-center mt-4">
          <p>
            Don&apos;t have an account?{" "}
            <Link href="/register" className="text-pink-400 underline">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";


interface User {
  id: string;
  name: string;
  email: string;
  token: string;
  address?: string;
  city?: string;
  zip?: string;
  country?: string;
  points?: number;
  isAdmin?: boolean;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  updateUser: (updatedUser: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // ✅ Load user from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        const tokenPayload = JSON.parse(atob(parsedUser.token.split(".")[1]));

        const isExpired = tokenPayload.exp * 1000 < Date.now();
        if (isExpired) {
          console.warn("⏰ Token expired. Logging out.");
          localStorage.removeItem("user");
          setUser(null);
          router.push("/login");
        } else {
          setUser(parsedUser);
        }
      } catch (err) {
        console.error("❌ Failed to parse token:", err);
        localStorage.removeItem("user");
        setUser(null);
      }
    }

    setLoading(false);
  }, []);

  // ✅ Login function
  const login = async (email: string, password: string) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Login failed");

      if (!data.user || !data.user.id) {
        throw new Error("❌ User ID is missing from API response!");
      }

      const userData = {
        id: data.user.id,
        name: data.user.name,
        email: data.user.email,
        token: data.token,
        address: data.user.address || "",
        city: data.user.city || "",
        zip: data.user.zip || "",
        country: data.user.country || "",
        points: data.user.points || 0,
        isAdmin: Boolean(data.user.isAdmin),
      };

      localStorage.setItem("user", JSON.stringify(userData));
      setUser(userData);

      router.push(userData.isAdmin ? "/admin" : "/dashboard");
    } catch (error) {
      console.error("❌ Login Error:", error);
      alert(error instanceof Error ? error.message : "An unknown error occurred");
    }
  };

  // ✅ Update user info locally
  const updateUser = (updatedUser: Partial<User>) => {
    if (user) {
      const newUser = { ...user, ...updatedUser };
      setUser(newUser);
      localStorage.setItem("user", JSON.stringify(newUser));
    }
  };

  // ✅ Logout
  const logout = () => {
    localStorage.removeItem("user");
    setUser(null);
    router.push("/login");
  };

  if (loading) return <p className="text-center text-white">Loading...</p>;

  return (
    <AuthContext.Provider value={{ user, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

// ✅ Hook
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
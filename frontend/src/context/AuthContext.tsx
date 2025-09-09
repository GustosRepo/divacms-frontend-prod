"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { login as apiLogin, fetchMe } from "@/utils/api";


interface User {
  id: string;
  userId?: string; // Add userId for JWT compatibility
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
  logout: () => Promise<void>;
  updateUser: (updatedUser: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // ✅ Bootstrap user from server-side cookie via /api/auth/me
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const u = await fetchMe();
        if (!mounted) return;
        if (u) {
          setUser(u);
        } else {
          setUser(null);
        }
      } catch (err) {
        console.error("Failed to bootstrap user:", err);
        setUser(null);
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  // ✅ Login function
  const login = async (email: string, password: string) => {
    try {
      const data = await apiLogin(email, password);
      // data.user should be present
      if (!data?.user) throw new Error("Invalid login response");
      setUser(data.user);
      // do not store token in localStorage; cookie is HttpOnly
      router.push(data.user.isAdmin ? "/admin" : "/dashboard");
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
    }
  };

  // ✅ Logout - call frontend proxy to clear HttpOnly cookie, then clear client state
  const logout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST", credentials: "include" });
    } catch (err) {
      // ignore network errors, still clear client state
      console.error("Logout proxy failed:", err);
    }

    localStorage.removeItem("user");
    setUser(null);
    router.push("/login");
  };

  if (loading) return <p className="text-center">Loading...</p>;

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

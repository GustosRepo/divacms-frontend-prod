"use client";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { safeFetch } from "@/utils/api";
import { useRouter } from "next/navigation";

interface User {
  id: string;
  email: string;
  role: string;
}

export default function AdminUsersPage() {
  const { user } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const router = useRouter();


  useEffect(() => {
  if (!user) return;

    const fetchUsers = async () => {
      try {
        const data = await safeFetch(`/admin/users`);
        setUsers(data.users || data || []);
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [user]);

  const handlePromote = async (userId: string, newRole: "admin" | "customer") => {
  if (!user) return;
  
    try {
      const data = await safeFetch(`/admin/users/${userId}`, { 
        method: "PUT", 
        headers: { "Content-Type": "application/json" }, 
        body: JSON.stringify({ role: newRole }) 
      });

      // ✅ Update UI state
      setUsers((prevUsers) =>
        prevUsers.map((u) =>
          u.id === userId ? { ...u, role: newRole } : u
        )
      );
      setMessage(`User role updated to ${newRole}`);
    } catch (error) {
      console.error("❌ Error updating user role:", error);
      if (error instanceof Error) {
        alert(error.message); // Show the actual error message
      } else {
        alert("An unknown error occurred");
      }
    }
  };

  const handleDelete = async (userId: string) => {
  if (!user) return;

    if (!confirm("Are you sure you want to delete this user?")) return;

    try {
      await safeFetch(`/admin/users/${userId}`, { 
        method: "DELETE", 
        headers: { 'Content-Type': 'application/json' } 
      });

      setUsers((prevUsers) => prevUsers.filter((u) => u.id !== userId));
      setMessage("User deleted successfully");
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  return (
    <div className="container mx-auto px-6 py-10 text-white">
      <h1 className="text-3xl font-bold text-center">Admin - Manage Users</h1>
      <button
      onClick={() => router.push("/admin")}
      className="mb-4 px-4 py-2 bg-pink-500 hover:bg-pink-700 text-white rounded-md"
    >
      ⬅️ Back to Admin Dashboard
    </button>

      {message && <p className="text-center text-green-500">{message}</p>}

      {loading ? (
        <p className="text-center">Loading users...</p>
      ) : (
        <table className="w-full mt-6 bg-black/40 text-white border border-gray-700">
          <thead>
            <tr className="bg-pink-500 text-white">
              <th className="py-2 px-4 border">User ID</th>
              <th className="py-2 px-4 border">Email</th>
              <th className="py-2 px-4 border">Role</th>
              <th className="py-2 px-4 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="text-center border-b">
                <td className="py-2 px-4">{u.id}</td>
                <td className="py-2 px-4">{u.email}</td>
                <td className="py-2 px-4">{u.role}</td>
                <td className="py-2 px-4">
                  {u.role !== "admin" ? (
                    <button
                      onClick={() => handlePromote(u.id, "admin")}
                      className="bg-green-500 text-white px-3 py-1 rounded-md"
                    >
                      Make Admin
                    </button>
                  ) : (
                    <button
                      onClick={() => handlePromote(u.id, "customer")}
                      className="bg-yellow-500 text-black px-3 py-1 rounded-md"
                    >
                      Demote to User
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(u.id)}
                    className="bg-red-500 text-white px-3 py-1 rounded-md ml-2"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
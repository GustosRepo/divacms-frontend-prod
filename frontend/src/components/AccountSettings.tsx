"use client";
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { safeFetch } from "@/utils/api";

export default function AccountSettings() {
  const { user, logout, updateUser } = useAuth(); // ✅ Now updateUser is available
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    address: "",
    city: "",
    zip: "",
    country: "",
  });

  const [message, setMessage] = useState("");
  const [pwd, setPwd] = useState({ current: "", next: "", confirm: "" });
  const [pwdMessage, setPwdMessage] = useState("");
  const [pwdLoading, setPwdLoading] = useState(false);

  useEffect(() => {
    if (!user) return;
  
    const fetchProfile = async () => {
      try {
        const data = await safeFetch(`/users/${user.id}`);

        setFormData({
          id: data.id || "", 
          name: data.name || "",
          address: data.address || "",
          city: data.city || "",
          zip: data.zip || "",
          country: data.country || "",
        });
      } catch (err) {
        console.error("❌ Error fetching profile:", err);
        
        // Handle "User not found" gracefully
        const errorMessage = err instanceof Error ? err.message : String(err);
        if (errorMessage.includes("User not found") || errorMessage.includes("404")) {
          // Set form with default values using current user data
          setFormData({
            id: user.id || "",
            name: user.name || "",
            address: "",
            city: "",
            zip: "",
            country: "",
          });
          setMessage("Profile data not found. Please update your information.");
        } else {
          setMessage("Error fetching profile. Please try again.");
        }
      }
    };
  
    fetchProfile();
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    if (!formData.id) {
      setMessage("Error: User ID is missing. Please log in again.");
      return;
    }
  
    console.log("📤 Sending profile update:", formData); // ✅ Log request data

    try {
  await safeFetch(`/users/update`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      updateUser(formData); // Update user in context
      setMessage("Profile updated successfully!");
    } catch (error) {
      console.error("❌ Fetch error:", error);
      setMessage(`Error: ${error instanceof Error ? error.message : "An unknown error occurred"}`);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPwdMessage("");

    if (!pwd.current || !pwd.next || !pwd.confirm) {
      setPwdMessage("Please fill in all fields.");
      return;
    }
    if (pwd.next.length < 8) {
      setPwdMessage("New password must be at least 8 characters.");
      return;
    }
    if (pwd.next !== pwd.confirm) {
      setPwdMessage("New passwords do not match.");
      return;
    }
    if (pwd.current === pwd.next) {
      setPwdMessage("New password must be different from current.");
      return;
    }

    try {
      setPwdLoading(true);
      await safeFetch(`/users/change-password`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword: pwd.current, newPassword: pwd.next }),
      });
      setPwd({ current: "", next: "", confirm: "" });
      setPwdMessage("Password updated successfully.");
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      setPwdMessage(msg || "Failed to update password.");
    } finally {
      setPwdLoading(false);
    }
  };

  return (
    <div className="p-6 bg-black/30 w-1/2 rounded-lg shadow-lg">
      <h2 className="text-xl font-bold text-pink-500">Account Settings</h2>

      {message && <p className="text-center text-green-500">{message}</p>}


      <form onSubmit={handleSubmit} className="mt-4 space-y-4">
        <input type="hidden" name="id" value={formData.id} />
        <input type="text" name="name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="Name" className="p-2 text-black rounded-lg w-full" />
        <input type="text" name="address" value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} placeholder="Address" className="p-2 text-black rounded-lg w-full" />
        <input type="text" name="city" value={formData.city} onChange={(e) => setFormData({ ...formData, city: e.target.value })} placeholder="City" className="p-2 text-black rounded-lg w-full" />
        <input type="text" name="zip" value={formData.zip} onChange={(e) => setFormData({ ...formData, zip: e.target.value })} placeholder="ZIP Code" className="p-2 text-black rounded-lg w-full" />
        <input type="text" name="country" value={formData.country} onChange={(e) => setFormData({ ...formData, country: e.target.value })} placeholder="Country" className="p-2 text-black rounded-lg w-full" />

        <button type="submit" className="mt-4 bg-pink-500 hover:bg-pink-700 text-white px-6 py-2 rounded-md w-full">
          Update Profile
        </button>
      </form>

      <div className="mt-8 border-t border-white/20 pt-6">
        <h3 className="text-lg font-semibold text-pink-400">Change Password</h3>
        {pwdMessage && (
          <p className={`mt-2 text-center ${pwdMessage.includes("successfully") ? "text-green-500" : "text-red-400"}`}>
            {pwdMessage}
          </p>
        )}
        <form onSubmit={handlePasswordSubmit} className="mt-4 space-y-4">
          <input
            type="password"
            name="currentPassword"
            value={pwd.current}
            onChange={(e) => setPwd({ ...pwd, current: e.target.value })}
            placeholder="Current password"
            className="p-2 text-black rounded-lg w-full"
            autoComplete="current-password"
          />
          <input
            type="password"
            name="newPassword"
            value={pwd.next}
            onChange={(e) => setPwd({ ...pwd, next: e.target.value })}
            placeholder="New password"
            className="p-2 text-black rounded-lg w-full"
            autoComplete="new-password"
          />
          <input
            type="password"
            name="confirmNewPassword"
            value={pwd.confirm}
            onChange={(e) => setPwd({ ...pwd, confirm: e.target.value })}
            placeholder="Confirm new password"
            className="p-2 text-black rounded-lg w-full"
            autoComplete="new-password"
          />

          <button
            type="submit"
            disabled={pwdLoading}
            className="mt-2 bg-pink-500 hover:bg-pink-700 disabled:opacity-60 text-white px-6 py-2 rounded-md w-full"
          >
            {pwdLoading ? "Updating..." : "Update Password"}
          </button>
        </form>
      </div>

      <button onClick={logout} className="mt-4 bg-red-500 text-white px-4 py-2 rounded-md">
        Log Out
      </button>
    </div>
  );
}
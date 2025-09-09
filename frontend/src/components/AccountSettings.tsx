"use client";
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";

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

  useEffect(() => {
    if (!user) return;
  
    const fetchProfile = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/${user.id}`, {
          headers: { "Content-Type": "application/json" },
          credentials: 'include',
        });
  
        if (!res.ok) throw new Error("Failed to fetch profile.");
  
        const data = await res.json();
  
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
        setMessage("Error fetching profile. Please try again.");
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
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/update`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: "",
        },
        body: JSON.stringify(formData), // ✅ Ensure city, zip, and country are sent
      });
  
      if (!res.ok) throw new Error(`Failed to update profile: ${res.statusText}`);
  
  await res.json();
  updateUser(formData); // Update user in context
      setMessage("Profile updated successfully!");
    } catch (error) {
      console.error("❌ Fetch error:", error);
      setMessage(`Error: ${error instanceof Error ? error.message : "An unknown error occurred"}`);
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

      <button onClick={logout} className="mt-4 bg-red-500 text-white px-4 py-2 rounded-md">
        Log Out
      </button>
    </div>
  );
}
"use client";
import { useState } from "react";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [message, setMessage] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
  
    try {
      const res = await fetch("http://localhost:3001/email/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: "natnaree@divafactorynails.com", // Who receives the message
          subject: `New message from ${formData.name} (${formData.email})`,
          text: formData.message,
          replyTo: formData.email, // 👈 This is what makes replies go to the sender
        }),
      });
  
      if (!res.ok) throw new Error("Email failed");
  
      setMessage("✅ Message sent successfully!");
      setFormData({ name: "", email: "", message: "" });
    } catch (err) {
      console.error("❌ Email error:", err);
      setMessage("❌ Something went wrong. Please try again.");
    }
  
    setTimeout(() => setMessage(null), 3000);
  };

  return (
    <div className="min-h-screen  text-gray-900 flex flex-col items-center justify-center p-8 pt-24">
      
      {/* Page Header */}
      <h1 className="text-6xl font-extrabold text-gray-900 tracking-widest drop-shadow-md text-center">
        💌 Get In Touch
      </h1>
      <p className="max-w-2xl text-lg text-center leading-relaxed font-medium text-gray-700 mt-4">
        Whether you have questions, need help, or just want to say hello, we’re here for you!  
      </p>

      {/* Message Notification */}
      {message && (
        <p className="text-green-600 text-lg font-semibold mt-6 bg-white px-6 py-3 rounded-lg shadow-md">
          {message}
        </p>
      )}

      {/* Contact Form */}
      <div className="mt-10 bg-white p-8 rounded-xl shadow-2xl max-w-lg w-full backdrop-blur-md bg-opacity-80 border border-gray-200">
        <form onSubmit={handleSubmit}>
          <label className="block text-gray-900 font-semibold">Name:</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full p-3 text-gray-900 rounded-lg mt-2 border border-gray-300 focus:ring-2 focus:ring-pink-500 outline-none"
            required
          />

          <label className="block text-gray-900 font-semibold mt-4">Email:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full p-3 text-gray-900 rounded-lg mt-2 border border-gray-300 focus:ring-2 focus:ring-pink-500 outline-none"
            required
          />

          <label className="block text-gray-900 font-semibold mt-4">Message:</label>
          <textarea
            name="message"
            value={formData.message}
            onChange={handleChange}
            className="w-full p-3 text-gray-900 rounded-lg mt-2 border border-gray-300 focus:ring-2 focus:ring-pink-500 outline-none h-32"
            required
          />

          <button type="submit" className="mt-6 bg-pink-500 text-white font-semibold px-6 py-3 rounded-lg w-full hover:bg-pink-600 transition duration-300 transform hover:-translate-y-1 shadow-lg">
            📩 Send Message
          </button>
        </form>
      </div>

      {/* Contact Details & Socials */}
      <div className="mt-16 text-center">
        <h2 className="text-4xl font-bold text-gray-900">📧 Our Email</h2>
        <p className="text-xl text-gray-700 mt-2">support@divanails.com</p>

        <h2 className="text-4xl font-bold text-gray-900 mt-10">💖 Follow Us</h2>
        <p className="text-lg text-gray-700 mt-2">Stay connected and get the latest updates:</p>

        <div className="flex justify-center mt-6 space-x-8">
          <a href="https://instagram.com" target="_blank" className="hover:text-pink-600 text-pink-500 font-semibold text-lg transition-all duration-300">
            Instagram
          </a>
          <a href="https://tiktok.com" target="_blank" className="hover:text-black text-gray-800 font-semibold text-lg transition-all duration-300">
            TikTok
          </a>
          <a href="https://facebook.com" target="_blank" className="hover:text-blue-600 text-blue-500 font-semibold text-lg transition-all duration-300">
            Facebook
          </a>
        </div>
      </div>

    </div>
  );
}
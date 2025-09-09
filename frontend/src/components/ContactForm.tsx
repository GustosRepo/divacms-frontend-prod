"use client";
import React, { useState } from "react";

interface FormState {
  name: string;
  email: string;
  subject: string;
  message: string;
}

const initialState: FormState = { name: "", email: "", subject: "General Inquiry", message: "" };

export default function ContactForm() {
  const [form, setForm] = useState<FormState>(initialState);
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [error, setError] = useState<string>("");


  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("submitting");
    setError("");

    // Basic validation
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      setError("Please fill in name, email and message.");
      setStatus("error");
      return;
    }

    try {
      const payload = {
  to: "admin@thedivafactory.com", // destination inbox (updated)
        subject: `[Contact] ${form.subject} – ${form.name}`,
        text: `<p><strong>Name:</strong> ${form.name}</p><p><strong>Email:</strong> ${form.email}</p><p><strong>Subject:</strong> ${form.subject}</p><p><strong>Message:</strong><br/>${form.message.replace(/\n/g, '<br/>')}</p>`,
        replyTo: form.email,
      };

      const res = await fetch(`/api/proxy/email/send`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error(`Request failed (${res.status})`);

      setStatus("success");
      setForm(initialState);
    } catch (err) {
      console.error("Contact form error", err);
      const msg = err instanceof Error ? err.message : String(err);
      setError(msg || "Failed to send message");
      setStatus("error");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-gradient-to-br from-pink-900/30 to-purple-900/30 rounded-2xl p-8 shadow-xl border border-white/20 backdrop-blur-sm">
      <h2 className="font-display text-3xl font-semibold text-gradient-hotpink mb-6 text-center">Send a Message</h2>
      <div className="grid md:grid-cols-2 gap-6">
        <div className="flex flex-col">
          <label htmlFor="name" className="text-sm font-medium text-on-pastel-accent mb-1">Name *</label>
          <input
            id="name"
            name="name"
            type="text"
            value={form.name}
            onChange={handleChange}
            className="rounded-lg bg-white/70 dark:bg-white/10 border border-white/40 px-4 py-2 text-sm text-on-pastel-strong placeholder:text-on-pastel-soft/60 focus:outline-none focus:ring-2 focus:ring-pink-400"
            placeholder="Your name"
            required
          />
        </div>
        <div className="flex flex-col">
          <label htmlFor="email" className="text-sm font-medium text-on-pastel-accent mb-1">Email *</label>
          <input
            id="email"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            className="rounded-lg bg-white/70 dark:bg-white/10 border border-white/40 px-4 py-2 text-sm text-on-pastel-strong placeholder:text-on-pastel-soft/60 focus:outline-none focus:ring-2 focus:ring-pink-400"
            placeholder="you@email.com"
            required
          />
        </div>
        <div className="flex flex-col md:col-span-2">
          <label htmlFor="subject" className="text-sm font-medium text-on-pastel-accent mb-1">Subject</label>
          <select
            id="subject"
            name="subject"
            value={form.subject}
            onChange={handleChange}
            className="rounded-lg bg-white/70 dark:bg-white/10 border border-white/40 px-4 py-2 text-sm text-on-pastel-strong focus:outline-none focus:ring-2 focus:ring-pink-400"
          >
            <option>General Inquiry</option>
            <option>Order Help</option>
            <option>Custom Nails</option>
            <option>Wholesale</option>
            <option>Press / Collaboration</option>
          </select>
        </div>
        <div className="flex flex-col md:col-span-2">
          <label htmlFor="message" className="text-sm font-medium text-on-pastel-accent mb-1">Message *</label>
          <textarea
            id="message"
            name="message"
            rows={6}
            value={form.message}
            onChange={handleChange}
            className="rounded-lg bg-white/70 dark:bg-white/10 border border-white/40 px-4 py-3 text-sm leading-relaxed text-on-pastel-strong placeholder:text-on-pastel-soft/60 focus:outline-none focus:ring-2 focus:ring-pink-400 resize-y"
            placeholder="Tell us how we can help..."
            required
          />
        </div>
      </div>
      {status === "error" && (
        <p className="mt-4 text-sm text-red-600 font-medium">{error}</p>
      )}
      {status === "success" && (
        <p className="mt-4 text-sm text-green-600 font-medium">Message sent! We&apos;ll reply soon.</p>
      )}
      <div className="mt-8 flex items-center justify-between gap-4 flex-wrap">
        <button
          type="submit"
          disabled={status === "submitting"}
          className="font-display inline-flex items-center justify-center px-8 py-3 rounded-full bg-gradient-to-r from-pink-500 via-fuchsia-500 to-blue-500 text-white text-sm font-semibold shadow-lg hover:shadow-xl transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {status === "submitting" ? "Sending..." : "Send Message"}
        </button>
        <p className="text-xs text-on-pastel-soft/80">We respond within 24h (Mon–Fri).</p>
      </div>
    </form>
  );
}

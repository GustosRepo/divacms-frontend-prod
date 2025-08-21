"use client";
import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';

interface Category {
  id: string;
  name: string;
  slug?: string;
  brand_segment?: string;
  brandSegment?: string;
  description?: string;
}

export default function AdminCategoriesPage() {
  const { user } = useAuth();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string|null>(null);
  const [form, setForm] = useState<{ id?: string; name: string; slug: string; brandSegment: string; description: string }>({ name: '', slug: '', brandSegment: '', description: '' });
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/categories`);
      if (!res.ok) throw new Error('Failed to load categories');
      const data = await res.json();
      setCategories(data);
    } catch (e:any) {
      setError(e.message);
    } finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const resetForm = () => setForm({ name: '', slug: '', brandSegment: '', description: '' });

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) { alert('Auth required'); return; }
    setSaving(true);
    try {
      const payload = { name: form.name, slug: form.slug, brandSegment: form.brandSegment, description: form.description };
      const method = form.id ? 'PUT' : 'POST';
      const url = form.id ? `${process.env.NEXT_PUBLIC_API_URL}/categories/${form.id}` : `${process.env.NEXT_PUBLIC_API_URL}/categories`;
      const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${user.token}` }, body: JSON.stringify(payload) });
      if (!res.ok) throw new Error('Save failed');
      await load();
      resetForm();
    } catch (e:any) { alert(e.message); } finally { setSaving(false); }
  };

  const edit = (c: Category) => {
    setForm({ id: c.id, name: c.name, slug: c.slug || '', brandSegment: (c.brand_segment || c.brandSegment || ''), description: c.description || '' });
  };

  const del = async (id: string) => {
    if (!confirm('Delete category?')) return;
    if (!user) { alert('Auth required'); return; }
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/categories/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${user.token}` } });
      if (!res.ok) throw new Error('Delete failed');
      await load();
    } catch (e:any) { alert(e.message); }
  };

  return (
    <div className="pt-28 px-6 text-white max-w-5xl mx-auto space-y-10">
      <h1 className="text-3xl font-bold">Category Management</h1>
      <form onSubmit={submit} className="bg-gray-800 p-5 rounded space-y-4">
        <div className="grid md:grid-cols-4 gap-4">
          <div className="md:col-span-1">
            <label className="block text-sm">Name</label>
            <input value={form.name} onChange={e=>setForm(f=>({...f,name:e.target.value, slug: f.slug || e.target.value.toLowerCase().replace(/[^a-z0-9]+/g,'-')}))} className="w-full p-2 rounded text-black" required />
          </div>
          <div className="md:col-span-1">
            <label className="block text-sm">Slug</label>
            <input value={form.slug} onChange={e=>setForm(f=>({...f,slug:e.target.value}))} className="w-full p-2 rounded text-black" required />
          </div>
          <div className="md:col-span-1">
            <label className="block text-sm">Brand Segment</label>
            <select value={form.brandSegment} onChange={e=>setForm(f=>({...f,brandSegment:e.target.value}))} className="w-full p-2 rounded text-black" required>
              <option value="">Select</option>
              <option value="nails">Nails</option>
              <option value="toys">Toys</option>
              <option value="accessories">Accessories</option>
            </select>
          </div>
          <div className="md:col-span-1">
            <label className="block text-sm">Description</label>
            <input value={form.description} onChange={e=>setForm(f=>({...f,description:e.target.value}))} className="w-full p-2 rounded text-black" />
          </div>
        </div>
        <div className="flex gap-3">
          <button disabled={saving} className="bg-pink-500 hover:bg-pink-600 disabled:opacity-50 px-5 py-2 rounded font-semibold">{form.id? 'Update':'Create'} Category</button>
          {form.id && <button type="button" onClick={resetForm} className="bg-gray-600 px-4 py-2 rounded">Cancel</button>}
        </div>
      </form>
      <div>
        <h2 className="text-xl font-semibold mb-4">Existing Categories</h2>
        {loading && <p>Loading...</p>}
        {error && <p className="text-red-400">{error}</p>}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left bg-white/10">
                <th className="p-2">Name</th>
                <th className="p-2">Slug</th>
                <th className="p-2">Brand</th>
                <th className="p-2">Description</th>
                <th className="p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.map(c => (
                <tr key={c.id} className="border-t border-white/10 hover:bg-white/5">
                  <td className="p-2">{c.name}</td>
                  <td className="p-2">{c.slug}</td>
                  <td className="p-2 capitalize">{c.brand_segment || (c as any).brandSegment}</td>
                  <td className="p-2 max-w-xs truncate" title={c.description}>{c.description}</td>
                  <td className="p-2 flex gap-2">
                    <button onClick={()=>edit(c)} className="px-2 py-1 text-xs rounded bg-blue-500">Edit</button>
                    <button onClick={()=>del(c.id)} className="px-2 py-1 text-xs rounded bg-red-600">Delete</button>
                  </td>
                </tr>
              ))}
              {(!loading && categories.length===0) && <tr><td colSpan={5} className="p-4 text-center text-white/60">No categories</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

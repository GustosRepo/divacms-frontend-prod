
import React, { useState } from 'react';

interface ProductFormProps {
  initialData?: { title?: string; price?: number };
  onSubmit: (formData: { title?: string; price?: number }) => void;
}

export default function ProductForm({ initialData = {}, onSubmit }: ProductFormProps) {
    const [formData, setFormData] = useState<{ title?: string; price?: number }>(initialData);
  
    return (
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit(formData);
        }}
      >
        <input type="text" placeholder="Title" value={formData.title || ""} onChange={(e) => setFormData({ ...formData, title: e.target.value })} />
  <input type="number" placeholder="Price" value={formData.price ?? ""} onChange={(e) => setFormData({ ...formData, price: e.target.value ? Number(e.target.value) : undefined })} />
        <button type="submit">Save</button>
      </form>
    );
  }
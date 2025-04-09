
import { useState as reactUseState } from 'react';

function useState(initialData: {}): [any, any] {
    const [state, setState] = reactUseState(initialData);
    return [state, setState];
}


interface ProductFormProps {
  initialData?: { title?: string; price?: number };
  onSubmit: (formData: { title?: string; price?: number }) => void;
}

export default function ProductForm({ initialData = {}, onSubmit }: ProductFormProps) {
    const [formData, setFormData] = useState(initialData);
  
    return (
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit(formData);
        }}
      >
        <input type="text" placeholder="Title" value={formData.title || ""} onChange={(e) => setFormData({ ...formData, title: e.target.value })} />
        <input type="number" placeholder="Price" value={formData.price || ""} onChange={(e) => setFormData({ ...formData, price: e.target.value })} />
        <button type="submit">Save</button>
      </form>
    );
  }
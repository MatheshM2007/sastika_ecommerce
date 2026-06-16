'use client';

import { useEffect, useState } from 'react';
import { Pencil, Trash2, Plus } from 'lucide-react';
import { toast } from 'sonner';
import { api } from '@/lib/api';
import { formatINR } from '@/lib/utils';
import type { Product } from '@/types';

const emptyForm = {
  title: '',
  description: '',
  price: '',
  mrp: '',
  stock: '',
  category: 'Sarees',
  is_active: true,
};

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [image, setImage] = useState<File | null>(null);

  const load = () => api.get('/admin/products').then((res) => setProducts(res.data.data.products));

  useEffect(() => {
    load();
  }, []);

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setImage(null);
    setModal(true);
  };

  const openEdit = (p: Product) => {
    setEditing(p);
    setForm({
      title: p.title,
      description: p.description || '',
      price: String(p.price),
      mrp: String(p.mrp),
      stock: String(p.stock),
      category: p.category,
      is_active: p.is_active !== false,
    });
    setImage(null);
    setModal(true);
  };

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    const fd = new FormData();
    fd.append('title', form.title);
    fd.append('description', form.description);
    fd.append('price', form.price);
    fd.append('mrp', form.mrp);
    fd.append('stock', form.stock);
    fd.append('category', form.category);
    fd.append('is_active', String(form.is_active));
    if (image) fd.append('image', image);

    try {
      if (editing) {
        await api.put(`/products/${editing.id}`, fd, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        toast.success('Product updated');
      } else {
        await api.post('/products', fd, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        toast.success('Product created');
      }
      setModal(false);
      load();
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        'Save failed';
      toast.error(msg);
    }
  };

  const remove = async (id: number) => {
    if (!confirm('Delete this product?')) return;
    await api.delete(`/products/${id}`);
    toast.success('Deleted');
    load();
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="font-display text-2xl font-bold">Products</h1>
        <button
          type="button"
          onClick={openCreate}
          className="flex items-center gap-2 px-4 py-2 rounded-lg gradient-brand text-white text-sm"
        >
          <Plus className="w-4 h-4" /> Add Product
        </button>
      </div>

      <div className="overflow-x-auto rounded-xl border border-slate-800">
        <table className="w-full text-sm">
          <thead className="bg-slate-900 text-slate-400">
            <tr>
              <th className="text-left p-3">Title</th>
              <th className="text-left p-3">Category</th>
              <th className="text-left p-3">Price</th>
              <th className="text-left p-3">Stock</th>
              <th className="text-left p-3">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {products.map((p) => (
              <tr key={p.id} className="hover:bg-slate-900/50">
                <td className="p-3">{p.title}</td>
                <td className="p-3">{p.category}</td>
                <td className="p-3">{formatINR(Number(p.price))}</td>
                <td className="p-3">{p.stock}</td>
                <td className="p-3 flex gap-2">
                  <button type="button" onClick={() => openEdit(p)} className="p-1 hover:text-fuchsia-400">
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button type="button" onClick={() => remove(p.id)} className="p-1 hover:text-red-400">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modal && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
          <form
            onSubmit={save}
            className="w-full max-w-lg bg-slate-900 rounded-xl border border-slate-800 p-6 space-y-3 max-h-[90vh] overflow-y-auto"
          >
            <h2 className="font-semibold text-lg">{editing ? 'Edit' : 'Add'} Product</h2>
            {['title', 'description', 'price', 'mrp', 'stock', 'category'].map((field) => (
              <input
                key={field}
                placeholder={field}
                value={form[field as keyof typeof form] as string}
                onChange={(e) => setForm({ ...form, [field]: e.target.value })}
                required={field !== 'description'}
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-sm"
              />
            ))}
            <input type="file" accept="image/*" onChange={(e) => setImage(e.target.files?.[0] || null)} />
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={form.is_active}
                onChange={(e) => setForm({ ...form, is_active: e.target.checked })}
              />
              Active
            </label>
            <div className="flex gap-2 pt-2">
              <button type="submit" className="flex-1 py-2 rounded-lg gradient-brand text-white">
                Save
              </button>
              <button type="button" onClick={() => setModal(false)} className="flex-1 py-2 rounded-lg border border-slate-700">
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

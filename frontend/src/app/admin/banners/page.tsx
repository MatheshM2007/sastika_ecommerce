'use client';

import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { api } from '@/lib/api';

interface Banner {
  id: number;
  title: string;
  subtitle: string;
  image_url: string;
  link_url: string;
  is_active: boolean;
  sort_order: number;
}

const emptyForm = {
  title: '',
  subtitle: '',
  image_url: '',
  link_url: '/products',
  sort_order: 0,
  is_active: true,
};

export default function AdminBannersPage() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState<Banner | null>(null);
  const [form, setForm] = useState(emptyForm);

  const load = () => api.get('/banners').then((res) => setBanners(res.data.data.banners));

  useEffect(() => { load(); }, []);

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setModal(true);
  };

  const openEdit = (b: Banner) => {
    setEditing(b);
    setForm({
      title: b.title,
      subtitle: b.subtitle,
      image_url: b.image_url,
      link_url: b.link_url,
      sort_order: b.sort_order,
      is_active: b.is_active,
    });
    setModal(true);
  };

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editing) {
        await api.put(`/banners/${editing.id}`, form);
        toast.success('Banner updated');
      } else {
        await api.post('/banners', form);
        toast.success('Banner created');
      }
      setModal(false);
      load();
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Save failed';
      toast.error(msg);
    }
  };

  const remove = async (id: number) => {
    if (!confirm('Delete this banner?')) return;
    await api.delete(`/banners/${id}`);
    toast.success('Banner deleted');
    load();
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="font-display text-2xl font-bold">Banners</h1>
        <button
          type="button"
          onClick={openCreate}
          className="flex items-center gap-2 px-4 py-2 rounded-lg gradient-brand text-white text-sm"
        >
          <Plus className="w-4 h-4" /> Add Banner
        </button>
      </div>

      <div className="grid gap-4">
        {banners.map((b) => (
          <div
            key={b.id}
            className="flex items-center gap-4 p-4 rounded-xl border border-gray-700/50 bg-gray-800/60"
          >
            <div className="w-32 h-20 rounded-lg overflow-hidden bg-gray-700 shrink-0">
              {b.image_url ? (
                <img src={b.image_url} alt={b.title} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-500 text-xs">No image</div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-gray-200">{b.title || '(no title)'}</p>
              <p className="text-sm text-gray-400 truncate">{b.subtitle}</p>
              <div className="flex gap-3 mt-1 text-xs text-gray-500">
                <span>Order: {b.sort_order}</span>
                <span className={b.is_active ? 'text-emerald-400' : 'text-red-400'}>
                  {b.is_active ? 'Active' : 'Inactive'}
                </span>
              </div>
            </div>
            <div className="flex gap-2 shrink-0">
              <button type="button" onClick={() => openEdit(b)} className="p-2 hover:text-purple-400 text-gray-400">
                <Pencil className="w-4 h-4" />
              </button>
              <button type="button" onClick={() => remove(b.id)} className="p-2 hover:text-red-400 text-gray-400">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
        {banners.length === 0 && (
          <p className="text-gray-400 text-center py-8">No banners yet. Create your first banner!</p>
        )}
      </div>

      {modal && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
          <form
            onSubmit={save}
            className="w-full max-w-lg bg-gray-900 rounded-xl border border-gray-700/50 p-6 space-y-3 max-h-[90vh] overflow-y-auto"
          >
            <h2 className="font-semibold text-lg text-gray-100">{editing ? 'Edit' : 'Add'} Banner</h2>
            <input
              placeholder="Title"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="w-full px-3 py-2 rounded-lg bg-gray-800 border border-gray-600 text-gray-200 text-sm"
            />
            <input
              placeholder="Subtitle"
              value={form.subtitle}
              onChange={(e) => setForm({ ...form, subtitle: e.target.value })}
              className="w-full px-3 py-2 rounded-lg bg-gray-800 border border-gray-600 text-gray-200 text-sm"
            />
            <input
              placeholder="Image URL (direct link to image)"
              value={form.image_url}
              onChange={(e) => setForm({ ...form, image_url: e.target.value })}
              className="w-full px-3 py-2 rounded-lg bg-gray-800 border border-gray-600 text-gray-200 text-sm"
            />
            {form.image_url && (
              <div className="w-full h-32 rounded-lg overflow-hidden bg-gray-800 border border-gray-700">
                <img src={form.image_url} alt="preview" className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
              </div>
            )}
            <input
              placeholder="Link URL (e.g., /products?category=Sarees)"
              value={form.link_url}
              onChange={(e) => setForm({ ...form, link_url: e.target.value })}
              className="w-full px-3 py-2 rounded-lg bg-gray-800 border border-gray-600 text-gray-200 text-sm"
            />
            <div className="flex gap-3">
              <input
                type="number"
                placeholder="Sort order"
                value={form.sort_order}
                onChange={(e) => setForm({ ...form, sort_order: parseInt(e.target.value) || 0 })}
                className="w-32 px-3 py-2 rounded-lg bg-gray-800 border border-gray-600 text-gray-200 text-sm"
              />
              <label className="flex items-center gap-2 text-sm text-gray-300">
                <input
                  type="checkbox"
                  checked={form.is_active}
                  onChange={(e) => setForm({ ...form, is_active: e.target.checked })}
                  className="accent-purple-500"
                />
                Active
              </label>
            </div>
            <div className="flex gap-2 pt-2">
              <button type="submit" className="flex-1 py-2 rounded-lg gradient-brand text-white">
                Save
              </button>
              <button type="button" onClick={() => setModal(false)} className="flex-1 py-2 rounded-lg border border-gray-600 text-gray-300">
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
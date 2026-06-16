'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { api } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';

export default function ProfilePage() {
  const { user, loading: authLoading, updateUser } = useAuth();
  const [name, setName] = useState('');
  const [saving, setSaving] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && !user) router.push('/login?redirect=/profile');
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user) setName(user.name);
  }, [user]);

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const { data } = await api.put('/auth/profile', { name });
      updateUser(data.data.user);
      toast.success('Profile updated');
    } catch {
      toast.error('Update failed');
    } finally {
      setSaving(false);
    }
  };

  if (authLoading || !user) return null;

  return (
    <div className="max-w-md mx-auto px-4 py-8">
      <h1 className="font-display text-2xl font-bold mb-6">My Profile</h1>
      <form onSubmit={save} className="space-y-4 p-6 rounded-xl border border-slate-800 bg-slate-900/40">
        <div>
          <label className="block text-sm text-slate-400 mb-1">Name</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-2.5 rounded-lg bg-slate-900 border border-slate-700 focus:border-fuchsia-500 focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-sm text-slate-400 mb-1">Email</label>
          <input
            value={user.email}
            disabled
            className="w-full px-4 py-2.5 rounded-lg bg-slate-800 border border-slate-700 text-slate-500"
          />
        </div>
        <div>
          <label className="block text-sm text-slate-400 mb-1">Role</label>
          <p className="capitalize text-slate-300">{user.role}</p>
        </div>
        <button
          type="submit"
          disabled={saving}
          className="w-full py-3 rounded-xl gradient-brand text-white font-medium"
        >
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </form>
    </div>
  );
}

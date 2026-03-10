'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [regForm, setRegForm] = useState({ name: '', email: '', password: '', adminSecret: '' });

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true); setError('');
    const res = await fetch('/api/auth/login', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    if (!res.ok) { setError(data.error); setLoading(false); return; }
    router.push('/admin/dashboard');
  }

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true); setError('');
    const res = await fetch('/api/auth/register', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(regForm),
    });
    const data = await res.json();
    if (!res.ok) { setError(data.error); setLoading(false); return; }
    router.push('/admin/dashboard');
  }

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: '#0f0f0f' }}>
      <div className="w-full max-w-md p-8 rounded-2xl" style={{ background: '#1a1a1a', border: '1px solid #2a2a2a' }}>
        {/* Logo */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-white text-lg" style={{ background: '#eb1000' }}>P</div>
          <div>
            <p className="font-bold text-white text-lg">PDF<span style={{ color: '#eb1000' }}>.tools</span></p>
            <p className="text-xs" style={{ color: '#666' }}>Admin Panel</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-6 p-1 rounded-lg" style={{ background: '#111' }}>
          {(['login', 'register'] as const).map(tab => (
            <button key={tab} onClick={() => { setMode(tab); setError(''); }}
              className="flex-1 py-2 rounded-md text-sm font-medium capitalize transition-all"
              style={{ background: mode === tab ? '#2a2a2a' : 'transparent', color: mode === tab ? '#fff' : '#666' }}>
              {tab}
            </button>
          ))}
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-lg text-sm" style={{ background: 'rgba(235,16,0,0.1)', color: '#eb1000', border: '1px solid rgba(235,16,0,0.2)' }}>
            {error}
          </div>
        )}

        {mode === 'login' ? (
          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: '#888' }}>Email</label>
              <input type="email" required value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
                className="w-full px-3 py-2.5 rounded-lg text-sm outline-none transition-all"
                style={{ background: '#111', border: '1px solid #2a2a2a', color: '#fff' }}
                placeholder="admin@example.com" />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: '#888' }}>Password</label>
              <input type="password" required value={form.password} onChange={e => setForm({ ...form, password: e.target.value })}
                className="w-full px-3 py-2.5 rounded-lg text-sm outline-none"
                style={{ background: '#111', border: '1px solid #2a2a2a', color: '#fff' }}
                placeholder="••••••••" />
            </div>
            <button type="submit" disabled={loading}
              className="w-full py-2.5 rounded-lg text-sm font-semibold text-white transition-all mt-2"
              style={{ background: loading ? '#666' : '#eb1000', cursor: loading ? 'not-allowed' : 'pointer' }}>
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleRegister} className="flex flex-col gap-4">
            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: '#888' }}>Full Name</label>
              <input type="text" required value={regForm.name} onChange={e => setRegForm({ ...regForm, name: e.target.value })}
                className="w-full px-3 py-2.5 rounded-lg text-sm outline-none"
                style={{ background: '#111', border: '1px solid #2a2a2a', color: '#fff' }} placeholder="John Doe" />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: '#888' }}>Email</label>
              <input type="email" required value={regForm.email} onChange={e => setRegForm({ ...regForm, email: e.target.value })}
                className="w-full px-3 py-2.5 rounded-lg text-sm outline-none"
                style={{ background: '#111', border: '1px solid #2a2a2a', color: '#fff' }} placeholder="admin@example.com" />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: '#888' }}>Password</label>
              <input type="password" required value={regForm.password} onChange={e => setRegForm({ ...regForm, password: e.target.value })}
                className="w-full px-3 py-2.5 rounded-lg text-sm outline-none"
                style={{ background: '#111', border: '1px solid #2a2a2a', color: '#fff' }} placeholder="Min 8 characters" />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: '#888' }}>Admin Secret <span style={{ color: '#555' }}>(required if not first user)</span></label>
              <input type="password" value={regForm.adminSecret} onChange={e => setRegForm({ ...regForm, adminSecret: e.target.value })}
                className="w-full px-3 py-2.5 rounded-lg text-sm outline-none"
                style={{ background: '#111', border: '1px solid #2a2a2a', color: '#fff' }} placeholder="Secret key from .env" />
            </div>
            <button type="submit" disabled={loading}
              className="w-full py-2.5 rounded-lg text-sm font-semibold text-white transition-all mt-2"
              style={{ background: loading ? '#666' : '#eb1000', cursor: loading ? 'not-allowed' : 'pointer' }}>
              {loading ? 'Creating account...' : 'Create account'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

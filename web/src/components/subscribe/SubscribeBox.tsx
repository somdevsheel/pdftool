'use client';
import { useState } from 'react';

const API_BASE = process.env.NEXT_PUBLIC_ADMIN_API_URL || 'https://admin.freenoo.com';

interface SubscribeBoxProps {
  source?: 'popup' | 'sidebar' | 'footer';
  onSuccess?: () => void;
  compact?: boolean;
}

export default function SubscribeBox({ source = 'sidebar', onSuccess, compact = false }: SubscribeBoxProps) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setStatus('loading');
    try {
      const res = await fetch(`${API_BASE}/api/subscribe`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, source }),
      });
      const data = await res.json();
      if (data.success) {
        setStatus('success');
        setMessage(data.message || 'Subscribed!');
        setEmail('');
        onSuccess?.();
      } else {
        setStatus('error');
        setMessage(data.error || 'Something went wrong');
      }
    } catch {
      setStatus('error');
      setMessage('Network error — try again');
    }
  }

  if (status === 'success') return (
    <div className="flex items-center gap-2 py-2">
      <span className="text-xl">🎉</span>
      <p className="text-sm font-medium" style={{ color: '#059669' }}>{message}</p>
    </div>
  );

  return (
    <form onSubmit={handleSubmit} className={compact ? 'flex gap-2' : 'flex flex-col gap-2'}>
      <input
        type="email" value={email} onChange={e => setEmail(e.target.value)}
        placeholder="your@email.com" required
        className="flex-1 text-sm rounded-lg px-3 py-2 outline-none transition-all"
        style={{
          background: 'var(--surface-2, #1c1c1c)',
          border: '1px solid var(--border, #2a2a2a)',
          color: 'var(--text, #fff)',
        }}
      />
      <button type="submit" disabled={status === 'loading'}
        className="text-sm font-semibold px-4 py-2 rounded-lg text-white transition-all whitespace-nowrap"
        style={{ background: status === 'loading' ? '#555' : '#eb1000', cursor: status === 'loading' ? 'not-allowed' : 'pointer' }}>
        {status === 'loading' ? '...' : 'Subscribe'}
      </button>
      {status === 'error' && (
        <p className="text-xs" style={{ color: '#eb1000' }}>{message}</p>
      )}
    </form>
  );
}

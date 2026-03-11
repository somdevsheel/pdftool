'use client';
import { useEffect, useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';

interface Subscriber {
  _id: string; email: string; source: string; active: boolean; createdAt: string;
}

export default function SubscribersPage() {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [sending, setSending] = useState(false);
  const [digestResult, setDigestResult] = useState('');

  useEffect(() => {
    fetch('/api/subscribe')
      .then(r => r.json())
      .then(data => setSubscribers(data.subscribers || []))
      .finally(() => setLoading(false));
  }, []);

  const filtered = subscribers.filter(s =>
    s.email.toLowerCase().includes(search.toLowerCase())
  );

  function exportCSV() {
    const rows = ['Email,Source,Date', ...filtered.map(s =>
      `${s.email},${s.source},${new Date(s.createdAt).toLocaleDateString()}`
    )].join('\n');
    const blob = new Blob([rows], { type: 'text/csv' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'subscribers.csv';
    a.click();
  }

  async function sendDigest() {
    const secret = prompt('Enter DIGEST_SECRET to send digest:');
    if (!secret) return;
    if (!confirm(`Send weekly digest to ${subscribers.length} subscribers?`)) return;

    setSending(true); setDigestResult('');
    try {
      const res = await fetch('/api/digest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ secret }),
      });
      const data = await res.json();
      setDigestResult(data.message || data.error || 'Done');
    } catch {
      setDigestResult('Network error');
    } finally {
      setSending(false);
    }
  }

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Subscribers</h1>
          <p className="text-sm mt-1" style={{ color: '#888' }}>
            {subscribers.length} active subscriber{subscribers.length !== 1 ? 's' : ''}
          </p>
        </div>
        <div className="flex gap-2">
          <button onClick={exportCSV}
            className="px-4 py-2 rounded-lg text-sm font-medium"
            style={{ background: '#1a1a1a', color: '#888', border: '1px solid #2a2a2a' }}>
            Export CSV
          </button>
          <button onClick={sendDigest} disabled={sending}
            className="px-4 py-2 rounded-lg text-sm font-medium text-white"
            style={{ background: sending ? '#555' : '#eb1000', cursor: sending ? 'not-allowed' : 'pointer' }}>
            {sending ? 'Sending...' : '📬 Send Weekly Digest'}
          </button>
        </div>
      </div>

      {digestResult && (
        <div className="mb-6 px-4 py-3 rounded-lg text-sm"
          style={{ background: digestResult.includes('error') || digestResult.includes('Error') ? '#eb100011' : '#05966911',
                   color: digestResult.includes('error') || digestResult.includes('Error') ? '#eb1000' : '#059669',
                   border: `1px solid ${digestResult.includes('error') || digestResult.includes('Error') ? '#eb100033' : '#05966933'}` }}>
          {digestResult}
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {[
          { label: 'Total', value: subscribers.length, icon: '✉️' },
          { label: 'From Popup', value: subscribers.filter(s => s.source === 'popup').length, icon: '💬' },
          { label: 'From Sidebar', value: subscribers.filter(s => s.source === 'sidebar').length, icon: '📌' },
        ].map(stat => (
          <div key={stat.label} className="p-5 rounded-xl"
            style={{ background: '#111', border: '1px solid #1e1e1e' }}>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xl">{stat.icon}</span>
              <p className="text-xs font-medium uppercase tracking-wider" style={{ color: '#555' }}>{stat.label}</p>
            </div>
            <p className="text-3xl font-bold text-white">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="mb-4">
        <input value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Search by email..."
          className="px-4 py-2 rounded-lg text-sm w-full max-w-xs"
          style={{ background: '#111', border: '1px solid #2a2a2a', color: '#fff' }} />
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin"
            style={{ borderColor: '#eb1000', borderTopColor: 'transparent' }} />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-4xl mb-4">📭</p>
          <p className="text-lg font-medium text-white mb-2">No subscribers yet</p>
          <p className="text-sm" style={{ color: '#888' }}>Subscribers appear once they sign up via the sidebar or popup</p>
        </div>
      ) : (
        <div className="rounded-xl overflow-hidden" style={{ border: '1px solid #2a2a2a' }}>
          <table className="w-full">
            <thead>
              <tr style={{ background: '#1a1a1a', borderBottom: '1px solid #2a2a2a' }}>
                {['Email', 'Source', 'Joined'].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider" style={{ color: '#666' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((sub, i) => (
                <tr key={sub._id} style={{ borderBottom: '1px solid #1a1a1a', background: i % 2 === 0 ? '#111' : '#0f0f0f' }}>
                  <td className="px-4 py-3 text-sm text-white">{sub.email}</td>
                  <td className="px-4 py-3">
                    <span className="text-xs px-2 py-0.5 rounded-full"
                      style={{ background: sub.source === 'popup' ? '#2B5EE822' : '#05966922', color: sub.source === 'popup' ? '#2B5EE8' : '#059669' }}>
                      {sub.source}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm" style={{ color: '#888' }}>
                    {new Date(sub.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </AdminLayout>
  );
}
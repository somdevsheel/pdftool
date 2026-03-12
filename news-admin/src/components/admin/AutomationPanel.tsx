/**
 * news-admin/src/components/admin/AutomationPanel.tsx
 *
 * Drop this into the admin dashboard page.
 * Shows the last run status and a "Run Now" button.
 */

'use client';
import { useState } from 'react';

export default function AutomationPanel() {
  const [status, setStatus] = useState<'idle' | 'running' | 'done' | 'error'>('idle');
  const [message, setMessage] = useState('');

  async function handleRunNow() {
    setStatus('running');
    setMessage('');
    try {
      const res = await fetch('/api/automation/run', { method: 'POST' });
      const data = await res.json();
      if (!res.ok) {
        setStatus('error');
        setMessage(data.error || 'Failed to start automation');
      } else {
        setStatus('done');
        setMessage(data.message);
      }
    } catch {
      setStatus('error');
      setMessage('Network error — check server logs');
    }
  }

  const colors: Record<typeof status, string> = {
    idle:    '#6B7FD7',
    running: '#F5A623',
    done:    '#3FC87A',
    error:   '#E8526A',
  };

  return (
    <div style={{
      background: 'var(--surface, #252525)',
      border: '1px solid var(--border, #333)',
      borderRadius: 12,
      padding: '20px 24px',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
        <div>
          <h3 style={{ fontSize: 15, fontWeight: 600, color: 'var(--text, #fff)', margin: 0 }}>
            🤖 News Automation
          </h3>
          <p style={{ fontSize: 12, color: 'var(--text-muted, #888)', margin: '4px 0 0' }}>
            Auto-fetches tech news every hour from Google News RSS
          </p>
        </div>

        <button
          onClick={handleRunNow}
          disabled={status === 'running'}
          style={{
            background: status === 'running' ? '#333' : 'var(--accent, #eb1000)',
            color: '#fff',
            border: 'none',
            borderRadius: 8,
            padding: '8px 18px',
            fontSize: 13,
            fontWeight: 600,
            cursor: status === 'running' ? 'not-allowed' : 'pointer',
            opacity: status === 'running' ? 0.6 : 1,
            transition: 'opacity 0.15s',
          }}
        >
          {status === 'running' ? '⏳ Running...' : '▶ Run Now'}
        </button>
      </div>

      {message && (
        <div style={{
          marginTop: 10,
          padding: '8px 12px',
          borderRadius: 8,
          fontSize: 12,
          fontFamily: 'monospace',
          background: `${colors[status]}18`,
          color: colors[status],
          border: `1px solid ${colors[status]}44`,
        }}>
          {message}
        </div>
      )}

      <div style={{
        marginTop: 12,
        display: 'flex',
        gap: 12,
        flexWrap: 'wrap',
      }}>
        {['AI', 'Security', 'Cloud', 'Tools', 'Web', 'Mobile', 'Open Source', 'Startups'].map(cat => (
          <span key={cat} style={{
            fontSize: 11,
            padding: '2px 8px',
            borderRadius: 12,
            background: 'var(--surface-2, #333)',
            color: 'var(--text-muted, #888)',
          }}>
            {cat}
          </span>
        ))}
      </div>
    </div>
  );
}
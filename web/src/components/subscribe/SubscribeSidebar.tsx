'use client';
import SubscribeBox from './SubscribeBox';

export default function SubscribeSidebar() {
  return (
    <div className="rounded-xl overflow-hidden"
      style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>

      {/* Red gradient top */}
      <div style={{ height: '3px', background: 'linear-gradient(90deg, #eb1000, #ff6b35)' }} />

      <div className="p-5">
        <div className="w-10 h-10 rounded-lg flex items-center justify-center text-xl mb-3"
          style={{ background: '#eb100015' }}>
          📬
        </div>

        <h3 className="font-bold text-base mb-1" style={{ color: 'var(--text)' }}>
          Stay in the loop
        </h3>
        <p className="text-xs leading-relaxed mb-4" style={{ color: 'var(--text-muted)' }}>
          Weekly PDF tips, tool guides & tech news. No spam.
        </p>

        <SubscribeBox source="sidebar" />

        <p className="text-xs mt-3 text-center" style={{ color: 'var(--text-muted)', opacity: 0.5 }}>
          Unsubscribe anytime
        </p>
      </div>
    </div>
  );
}

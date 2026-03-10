'use client';
import { useEffect, useState } from 'react';
import SubscribeBox from './SubscribeBox';

interface SubscribePopupProps {
  onClose: () => void;
  source?: 'popup' | 'sidebar' | 'footer';
}

export default function SubscribePopup({ onClose, source = 'popup' }: SubscribePopupProps) {
  const [visible, setVisible] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 50);
    return () => clearTimeout(t);
  }, []);

  function close() {
    setVisible(false);
    setTimeout(onClose, 300);
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center px-4 pb-6 sm:pb-0"
      style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', transition: 'opacity 0.3s', opacity: visible ? 1 : 0 }}
      onClick={e => { if (e.target === e.currentTarget) close(); }}>

      <div
        className="w-full max-w-md rounded-2xl overflow-hidden"
        style={{
          background: '#141414',
          border: '1px solid #2a2a2a',
          boxShadow: '0 25px 60px rgba(0,0,0,0.7)',
          transform: visible ? 'translateY(0) scale(1)' : 'translateY(20px) scale(0.97)',
          transition: 'transform 0.3s cubic-bezier(0.34,1.56,0.64,1)',
        }}>

        {/* Top accent bar */}
        <div style={{ height: '3px', background: 'linear-gradient(90deg, #eb1000, #ff6b35)' }} />

        <div className="p-7">
          {/* Close */}
          <button onClick={close}
            className="absolute top-5 right-5 w-7 h-7 rounded-full flex items-center justify-center text-lg transition-all"
            style={{ background: '#1f1f1f', color: '#666' }}>×</button>

          {done ? (
            <div className="text-center py-4">
              <div className="text-4xl mb-3">🎉</div>
              <h3 className="font-bold text-lg text-white mb-1">You're in!</h3>
              <p className="text-sm" style={{ color: '#888' }}>Weekly PDF tips landing in your inbox.</p>
              <button onClick={close}
                className="mt-5 px-5 py-2 rounded-lg text-sm font-medium text-white"
                style={{ background: '#eb1000' }}>
                Keep reading
              </button>
            </div>
          ) : (
            <>
              {/* Icon */}
              <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl mb-4"
                style={{ background: '#eb100015' }}>📬</div>

              <h3 className="font-bold text-xl text-white mb-1">Enjoying this article?</h3>
              <p className="text-sm mb-1" style={{ color: '#aaa' }}>
                Get weekly PDF tips, tutorials and tool guides — straight to your inbox.
              </p>
              <p className="text-xs mb-5" style={{ color: '#555' }}>No spam. Unsubscribe anytime.</p>

              <SubscribeBox source={source} onSuccess={() => setDone(true)} />

              <button onClick={close}
                className="w-full mt-3 text-xs py-1 transition-all"
                style={{ color: '#555' }}>
                No thanks, I'll keep missing out
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

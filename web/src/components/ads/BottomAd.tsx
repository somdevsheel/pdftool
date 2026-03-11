import { ADS_ENABLED } from "@/lib/adsConfig";

export function BottomAd() {
  if (!ADS_ENABLED) return null;

  return (
    <div className="ad-placeholder w-full py-6 flex items-center justify-center" style={{ borderTop: '1px solid var(--border)' }}>
      <div className="text-center">
        <p className="text-xs font-mono uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>Advertisement</p>
        <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>728×90 Leaderboard</p>
      </div>
    </div>
  );
}
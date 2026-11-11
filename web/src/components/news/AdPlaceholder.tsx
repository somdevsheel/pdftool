import { ADS_ENABLED } from '@/lib/adsConfig';

type AdSize = 'leaderboard' | 'inline' | 'sidebar' | 'rectangle';

const SIZE_MAP: Record<AdSize, { width: string; height: string; label: string }> = {
  leaderboard: { width: '100%',   height: '90px',  label: '728×90 Leaderboard' },
  inline:      { width: '100%',   height: '90px',  label: '728×90 Inline' },
  sidebar:     { width: '100%',   height: '600px', label: '160×600 Wide Skyscraper' },
  rectangle:   { width: '100%',   height: '250px', label: '300×250 Rectangle' },
};

interface AdPlaceholderProps {
  size: AdSize;
  className?: string;
}

export default function AdPlaceholder({ size, className = '' }: AdPlaceholderProps) {
  if (!ADS_ENABLED) return null;

  const { width, height, label } = SIZE_MAP[size];

  return (
    <div
      className={`ad-placeholder flex items-center justify-center rounded-lg ${className}`}
      style={{ width, height, border: '1px dashed var(--border)', background: 'var(--surface)' }}
    >
      <div className="text-center">
        <p className="text-xs font-mono uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>
          Advertisement
        </p>
        <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>{label}</p>
      </div>
    </div>
  );
}
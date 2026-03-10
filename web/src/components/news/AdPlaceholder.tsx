type AdSize = 'leaderboard' | 'rectangle' | 'sidebar' | 'inline' | 'banner';

const AD_CONFIG: Record<AdSize, { w: string; h: string; label: string; dims: string }> = {
  leaderboard: { w: 'w-full', h: 'h-[90px]', label: 'Advertisement', dims: '728×90' },
  rectangle:   { w: 'w-full max-w-[336px]', h: 'h-[280px]', label: 'Advertisement', dims: '336×280' },
  sidebar:     { w: 'w-full', h: 'h-[600px]', label: 'Advertisement', dims: '300×600' },
  inline:      { w: 'w-full', h: 'h-[250px]', label: 'Advertisement', dims: '728×250' },
  banner:      { w: 'w-full', h: 'h-[60px]', label: 'Ad', dims: '468×60' },
};

export default function AdPlaceholder({ size = 'rectangle', className = '' }: { size?: AdSize; className?: string }) {
  const cfg = AD_CONFIG[size];
  return (
    <div className={`${cfg.w} ${cfg.h} flex flex-col items-center justify-center rounded-xl ${className}`}
      style={{ background: 'var(--surface)', border: '1px dashed var(--border)' }}>
      <p className="text-xs font-mono uppercase tracking-widest" style={{ color: 'var(--text-muted)', opacity: 0.4 }}>
        {cfg.label}
      </p>
      <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)', opacity: 0.3 }}>{cfg.dims}</p>
    </div>
  );
}

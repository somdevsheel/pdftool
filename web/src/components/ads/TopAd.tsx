// export function TopAd() {
//   return (
//     <div className="ad-placeholder w-full h-[90px] flex items-center justify-center">
//       <div className="text-center">
//         <p className="text-xs font-mono uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>Advertisement</p>
//         <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>728×90 Leaderboard</p>
//       </div>
//     </div>
//   );
// }





import { ADS_ENABLED } from "@/lib/adsConfig";

export function TopAd() {
  if (!ADS_ENABLED) return null;

  return (
    <div className="ad-placeholder w-full h-[90px] flex items-center justify-center">
      <div className="text-center">
        <p className="text-xs font-mono uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>Advertisement</p>
        <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>728×90 Leaderboard</p>
      </div>
    </div>
  );
}
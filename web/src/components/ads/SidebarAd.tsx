// export function SidebarAd() {
//   return (
//     <div className="ad-placeholder w-full rounded-lg flex items-center justify-center" style={{ height: '600px', border: '1px solid var(--border)' }}>
//       <div className="text-center">
//         <p className="text-xs font-mono uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>Advertisement</p>
//         <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>160×600 Wide Skyscraper</p>
//       </div>
//     </div>
//   );
// }





import { ADS_ENABLED } from "@/lib/adsConfig";

export function SidebarAd() {
  if (!ADS_ENABLED) return null;

  return (
    <div className="ad-placeholder w-full rounded-lg flex items-center justify-center" style={{ height: '600px', border: '1px solid var(--border)' }}>
      <div className="text-center">
        <p className="text-xs font-mono uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>Advertisement</p>
        <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>160×600 Wide Skyscraper</p>
      </div>
    </div>
  );
}
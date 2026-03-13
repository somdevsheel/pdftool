// 'use client';
// import Link from 'next/link';
// import { usePathname, useRouter } from 'next/navigation';
// import { ReactNode } from 'react';
// import type { JWTPayload } from '@/lib/auth';

// const NAV = [
//   { href: '/admin/dashboard', label: 'Dashboard', icon: '⊞' },
//   { href: '/admin/news', label: 'All Articles', icon: '📰' },
//   { href: '/admin/news/new', label: 'New Article', icon: '+' },
// ];

// export default function AdminLayout({ children, user }: { children: ReactNode; user: JWTPayload }) {
//   const pathname = usePathname();
//   const router = useRouter();

//   async function logout() {
//     await fetch('/api/auth/logout', { method: 'POST' });
//     router.push('/admin/login');
//   }

//   return (
//     <div className="min-h-screen flex" style={{ background: '#0f0f0f' }}>
//       {/* Sidebar */}
//       <aside className="w-56 flex-shrink-0 flex flex-col" style={{ background: '#111', borderRight: '1px solid #1f1f1f' }}>
//         <div className="p-5 flex items-center gap-3" style={{ borderBottom: '1px solid #1f1f1f' }}>
//           <div className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-white text-sm" style={{ background: '#eb1000' }}>F</div>
//           <div>
//             <p className="text-sm font-bold text-white">PDF<span style={{ color: '#eb1000' }}>.tools</span></p>
//             <p className="text-xs" style={{ color: '#555' }}>Admin</p>
//           </div>
//         </div>

//         <nav className="flex-1 p-3 flex flex-col gap-1">
//           {NAV.map(item => {
//             const active = pathname === item.href;
//             return (
//               <Link key={item.href} href={item.href}
//                 className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all"
//                 style={{
//                   background: active ? '#1f1f1f' : 'transparent',
//                   color: active ? '#fff' : '#666',
//                 }}>
//                 <span className="w-5 text-center">{item.icon}</span>
//                 {item.label}
//               </Link>
//             );
//           })}
//         </nav>

//         <div className="p-4" style={{ borderTop: '1px solid #1f1f1f' }}>
//           <div className="mb-3 px-1">
//             <p className="text-xs font-medium text-white truncate">{user.name}</p>
//             <p className="text-xs truncate capitalize" style={{ color: '#555' }}>{user.role}</p>
//           </div>
//           <button onClick={logout}
//             className="w-full px-3 py-2 rounded-lg text-xs font-medium transition-all text-left"
//             style={{ background: '#1f1f1f', color: '#666' }}>
//             Sign out
//           </button>
//         </div>
//       </aside>

//       {/* Main */}
//       <main className="flex-1 overflow-auto p-8">
//         {children}
//       </main>
//     </div>
//   );
// }



'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { ReactNode } from 'react';

const NAV = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: '⊞' },
  { label: '─── News ───', icon: '', href: '', divider: true },
  { href: '/admin/news', label: 'All Articles', icon: '📰' },
  { href: '/admin/news/new', label: 'New Article', icon: '✚' },
  { label: '─── Blog ───', icon: '', href: '', divider: true },
  { href: '/admin/blog', label: 'All Posts', icon: '📝' },
  { href: '/admin/blog/new', label: 'New Post', icon: '✚' },
  { label: '─── Audience ───', icon: '', href: '', divider: true },
  { href: '/admin/subscribers', label: 'Subscribers', icon: '✉️' },
];

export default function AdminLayout({ children, user }: { children: ReactNode; user?: any }) {
  const pathname = usePathname();
  const router = useRouter();

  async function logout() {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/admin/login');
  }

  return (
    <div className="min-h-screen flex" style={{ background: '#0f0f0f' }}>
      {/* Sidebar */}
      <aside className="w-56 flex-shrink-0 flex flex-col" style={{ background: '#111', borderRight: '1px solid #1f1f1f' }}>
        <div className="p-5 flex items-center gap-3" style={{ borderBottom: '1px solid #1f1f1f' }}>
          <img src="/logo.png" alt="Freenoo" style={{ height: '66px', width: 'auto' }} />
          {/* <div>
            <p className="text-sm font-bold text-white">Freenoo</p>
            <p className="text-xs" style={{ color: '#555' }}>Admin Panel</p>
          </div> */}
        </div>

        <nav className="flex-1 p-3 flex flex-col gap-0.5 overflow-y-auto">
          {NAV.map((item, i) => {
            if (item.divider) return (
              <p key={i} className="px-3 py-2 text-xs font-medium tracking-wider"
                style={{ color: '#333' }}>{item.label}</p>
            );
            const active = pathname === item.href || (item.href !== '/admin/dashboard' && pathname.startsWith(item.href + '/'));
            return (
              <Link key={item.href} href={item.href}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all"
                style={{
                  background: active ? '#1f1f1f' : 'transparent',
                  color: active ? '#fff' : '#666',
                }}>
                <span className="w-5 text-center text-xs">{item.icon}</span>
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-4" style={{ borderTop: '1px solid #1f1f1f' }}>
          {user && (
            <div className="mb-3 px-1">
              <p className="text-xs font-medium text-white truncate">{user.name}</p>
              <p className="text-xs truncate capitalize" style={{ color: '#555' }}>{user.role}</p>
            </div>
          )}
          <button onClick={logout}
            className="w-full px-3 py-2 rounded-lg text-xs font-medium transition-all text-left"
            style={{ background: '#1f1f1f', color: '#666' }}>
            Sign out
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-auto p-8">
        {children}
      </main>
    </div>
  );
}



// import { NextResponse } from 'next/server';
// import type { NextRequest } from 'next/server';
// import { verifyToken } from './src/lib/auth';

// export function middleware(request: NextRequest) {
//   const { pathname } = request.nextUrl;

//   // Protect all /admin routes except /admin/login
//   if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
//     const token = request.cookies.get('pdftool_admin_token')?.value;

//     if (!token || !verifyToken(token)) {
//       return NextResponse.redirect(new URL('/admin/login', request.url));
//     }
//   }

//   // Redirect /admin to /admin/dashboard
//   if (pathname === '/admin') {
//     return NextResponse.redirect(new URL('/admin/dashboard', request.url));
//   }

//   return NextResponse.next();
// }

// export const config = {
//   matcher: ['/admin/:path*'],
// };









import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyToken } from './src/lib/auth';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // ── Block direct browser access to /api/auth/register ────────────────────
  // Only allow POST from the admin app itself (same origin)
  // Anyone trying to visit it in a browser gets a 404-like response
  if (pathname === '/api/auth/register') {
    const method = request.method;
    const origin = request.headers.get('origin') || '';
    const host = request.headers.get('host') || '';

    // Allow only POST requests that come from the same host (same-origin form)
    if (method !== 'POST') {
      return new NextResponse(JSON.stringify({ error: 'Not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Block cross-origin POST (e.g. from attacker's website)
    if (origin && !origin.includes(host.split(':')[0])) {
      console.warn(`[REGISTER BLOCKED] Cross-origin attempt from: ${origin}`);
      return new NextResponse(JSON.stringify({ error: 'Forbidden' }), {
        status: 403,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  }

  // ── Protect all /admin/* routes except /admin/login ───────────────────────
  if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
    const token = request.cookies.get('pdftool_admin_token')?.value;

    if (!token) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }

    const payload = verifyToken(token);
    if (!payload) {
      // Token invalid or expired — clear cookie and redirect
      const res = NextResponse.redirect(new URL('/admin/login', request.url));
      res.cookies.delete('pdftool_admin_token');
      return res;
    }
  }

  // ── Redirect /admin → /admin/dashboard ───────────────────────────────────
  if (pathname === '/admin') {
    return NextResponse.redirect(new URL('/admin/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/api/auth/register'],
};

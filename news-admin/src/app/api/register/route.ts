import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { User } from '@/lib/models/User';
import { signToken, setCookieHeader, getAuthUser } from '@/lib/auth';

// Parse allowed emails from env — comma separated
// e.g. ADMIN_ALLOWED_EMAILS=you@gmail.com,partner@gmail.com
function getAllowedEmails(): string[] {
  const raw = process.env.ADMIN_ALLOWED_EMAILS || '';
  return raw
    .split(',')
    .map(e => e.trim().toLowerCase())
    .filter(Boolean);
}

export async function POST(req: NextRequest) {
  try {
    const { name, email, password, role } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json({ error: 'All fields required' }, { status: 400 });
    }

    if (password.length < 8) {
      return NextResponse.json({ error: 'Password must be at least 8 characters' }, { status: 400 });
    }

    // ── Email whitelist check ─────────────────────────────────────────────────
    const allowedEmails = getAllowedEmails();

    if (allowedEmails.length === 0) {
      // No whitelist configured — block ALL registrations for safety
      return NextResponse.json(
        { error: 'Registration is not configured. Contact the administrator.' },
        { status: 403 }
      );
    }

    if (!allowedEmails.includes(email.toLowerCase().trim())) {
      // Log attempt for visibility
      console.warn(`[REGISTER BLOCKED] Unauthorized email attempt: ${email}`);
      return NextResponse.json(
        { error: 'This email is not authorized to register.' },
        { status: 403 }
      );
    }
    // ─────────────────────────────────────────────────────────────────────────

    await connectDB();

    // After first admin exists — only existing admins can add more users
    const userCount = await User.countDocuments();
    if (userCount > 0) {
      const authUser = await getAuthUser();
      if (!authUser || authUser.role !== 'admin') {
        return NextResponse.json(
          { error: 'Only existing admins can add new users.' },
          { status: 403 }
        );
      }
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return NextResponse.json({ error: 'Email already registered' }, { status: 409 });
    }

    const user = await User.create({
      name,
      email,
      password,
      role: userCount === 0 ? 'admin' : (role || 'editor'),
    });

    const token = signToken({
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
      name: user.name,
    });

    const response = NextResponse.json({
      success: true,
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    });

    response.headers.set('Set-Cookie', setCookieHeader(token));
    return response;
  } catch (err) {
    console.error('[REGISTER ERROR]', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

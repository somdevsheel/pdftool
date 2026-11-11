import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { User } from '@/lib/models/User';
import { signToken, setCookieHeader, getAuthUser } from '@/lib/auth';

function getAllowedEmails() {
  const raw = process.env.ADMIN_ALLOWED_EMAILS || '';
  return raw.split(',').map(e => e.trim().toLowerCase()).filter(Boolean);
}

export async function POST(req: NextRequest) {
  try {
    const { name, email, password } = await req.json();
    if (typeof name !== 'string' || typeof email !== 'string' || typeof password !== 'string' || !name || !email || !password)
      return NextResponse.json({ error: 'All fields required' }, { status: 400 });
    if (password.length < 8)
      return NextResponse.json({ error: 'Password min 8 chars' }, { status: 400 });

    const allowedEmails = getAllowedEmails();
    if (allowedEmails.length === 0)
      return NextResponse.json({ error: 'Registration not configured.' }, { status: 403 });
    if (allowedEmails.indexOf(email.toLowerCase().trim()) === -1)
      return NextResponse.json({ error: 'This email is not authorized to register.' }, { status: 403 });

    await connectDB();
    // Self-registration only bootstraps the very first (admin) account. After that,
    // even allow-listed emails need an existing admin to add them.
    const userCount = await User.countDocuments();
    if (userCount > 0) {
      const authUser = await getAuthUser();
      if (!authUser || authUser.role !== 'admin')
        return NextResponse.json({ error: 'Only existing admins can add new users.' }, { status: 403 });
    }
    const existing = await User.findOne({ email: email.toLowerCase().trim() });
    if (existing)
      return NextResponse.json({ error: 'Email already registered' }, { status: 409 });

    const user = await User.create({ name, email, password, role: userCount === 0 ? 'admin' : 'editor' });
    const token = signToken({ userId: user._id.toString(), email: user.email, role: user.role, name: user.name });
    const response = NextResponse.json({ success: true, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
    response.headers.set('Set-Cookie', setCookieHeader(token));
    return response;
  } catch (err) {
    console.error('[REGISTER ERROR]', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { User } from '@/lib/models/User';
import { signToken, setCookieHeader, getAuthUser } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const { name, email, password, role, adminSecret } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json({ error: 'All fields required' }, { status: 400 });
    }

    if (password.length < 8) {
      return NextResponse.json({ error: 'Password must be at least 8 characters' }, { status: 400 });
    }

    await connectDB();

    // First user can register freely — subsequent users need existing admin token or secret
    const userCount = await User.countDocuments();

    if (userCount > 0) {
      const authUser = await getAuthUser();
      const secret = process.env.ADMIN_REGISTER_SECRET;

      if (!authUser && adminSecret !== secret) {
        return NextResponse.json({ error: 'Not authorized to register' }, { status: 403 });
      }

      if (authUser && authUser.role !== 'admin') {
        return NextResponse.json({ error: 'Only admins can create new users' }, { status: 403 });
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
    console.error(err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

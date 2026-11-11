import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { connectDB } from '@/lib/mongodb';
import { User } from '@/lib/models/User';
import { signToken, setCookieHeader } from '@/lib/auth';

const MAX_FAILED_LOGINS = 5;
const LOCK_MINUTES = 15;
// Compared against when the email doesn't exist, so both cases take the same time
// and response timing can't reveal which admin emails are registered.
let dummyHash: Promise<string> | null = null;
const getDummyHash = () => (dummyHash ??= bcrypt.hash('timing-equaliser-not-a-password', 12));

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();
    // Strings only — an object such as {"$ne": null} must never reach the query.
    if (typeof email !== 'string' || typeof password !== 'string' || !email || !password) {
      return NextResponse.json({ error: 'Email and password required' }, { status: 400 });
    }

    await connectDB();
    const user = await User.findOne({ email: email.toLowerCase().trim() });

    if (user?.lockUntil && user.lockUntil > new Date()) {
      const minutes = Math.ceil((user.lockUntil.getTime() - Date.now()) / 60_000);
      return NextResponse.json(
        { error: `Too many failed attempts. Try again in ${minutes} minute${minutes === 1 ? '' : 's'}.` },
        { status: 429 },
      );
    }

    const ok = user ? await user.comparePassword(password) : await bcrypt.compare(password, await getDummyHash());
    if (!user || !ok) {
      if (user) {
        const failed = (user.failedLoginCount || 0) + 1;
        const locked = failed >= MAX_FAILED_LOGINS;
        await User.updateOne(
          { _id: user._id },
          locked
            ? { $set: { failedLoginCount: 0, lockUntil: new Date(Date.now() + LOCK_MINUTES * 60_000) } }
            : { $set: { failedLoginCount: failed } },
        );
      }
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    if (user.failedLoginCount || user.lockUntil) {
      await User.updateOne({ _id: user._id }, { $set: { failedLoginCount: 0 }, $unset: { lockUntil: 1 } });
    }

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

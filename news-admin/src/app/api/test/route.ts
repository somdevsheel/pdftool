import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';

export async function GET() {
  const results: Record<string, string> = {};

  // Check env vars
  results.MONGODB_URI = process.env.MONGODB_URI ? '✅ set' : '❌ MISSING';
  results.JWT_SECRET = process.env.JWT_SECRET ? '✅ set' : '❌ MISSING';

  // Test MongoDB connection
  try {
    await connectDB();
    results.mongodb = '✅ connected';
  } catch (err) {
    results.mongodb = '❌ ' + (err instanceof Error ? err.message : String(err));
  }

  return NextResponse.json(results);
}

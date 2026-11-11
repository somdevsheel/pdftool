import { timingSafeEqual } from 'crypto';

/** Constant-time string comparison for secrets, so response timing can't leak them. */
export function safeEqual(a: string | null | undefined, b: string | null | undefined): boolean {
  if (typeof a !== 'string' || typeof b !== 'string' || !a || !b) return false;
  const ab = Buffer.from(a);
  const bb = Buffer.from(b);
  return ab.length === bb.length && timingSafeEqual(ab, bb);
}

/** Escapes user input for use inside a RegExp / Mongo `$regex` as a literal string. */
export function escapeRegex(input: string): string {
  return input.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/** Parses an integer query param and clamps it, falling back on garbage input. */
export function clampInt(value: string | null, fallback: number, min: number, max: number): number {
  const n = parseInt(value ?? '', 10);
  return Number.isFinite(n) ? Math.min(max, Math.max(min, n)) : fallback;
}

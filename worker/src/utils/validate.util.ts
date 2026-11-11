// Defense in depth: the API validates job payloads, but the worker re-checks every
// value it hands to an external tool, since anything that can write to the Redis
// queue can enqueue a job.

const RANGE_PART = /^(\d+|z)(-(\d+|z))?$/;

/** A qpdf page-range spec such as "1-3,5,7-z". Throws on anything else. */
export function toPageRange(spec: unknown): string {
  if (typeof spec !== 'string') throw new Error('Invalid page range');
  const cleaned = spec.replace(/\s+/g, '');
  if (!cleaned || cleaned.length > 500) throw new Error('Invalid page range');
  const parts = cleaned.split(',');
  if (!parts.every((p) => RANGE_PART.test(p) && !/^0/.test(p))) {
    throw new Error('Invalid page range. Use numbers, commas and hyphens, e.g. 1-3,5');
  }
  return cleaned;
}

/** A list of 1-based page numbers. Throws if any entry isn't a positive integer. */
export function toPageList(pages: unknown, maxLength = 10_000): number[] {
  if (!Array.isArray(pages) || pages.length > maxLength) throw new Error('Invalid page list');
  return pages.map((p) => {
    const n = typeof p === 'number' ? p : Number.NaN;
    if (!Number.isInteger(n) || n < 1) throw new Error('Invalid page number');
    return n;
  });
}

/** A finite number clamped to [min, max], or the fallback when absent/invalid. */
export function toNumber(value: unknown, fallback: number, min: number, max: number): number {
  const n = typeof value === 'number' ? value : Number(value);
  if (!Number.isFinite(n)) return fallback;
  return Math.min(max, Math.max(min, n));
}

export function oneOf<T extends string | number>(value: unknown, allowed: readonly T[], fallback: T): T {
  return allowed.includes(value as T) ? (value as T) : fallback;
}

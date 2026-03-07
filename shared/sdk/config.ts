export const DEFAULT_API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';

export function getApiBase(): string {
  if (typeof window !== 'undefined') {
    return (window as any).__API_BASE__ || DEFAULT_API_BASE;
  }
  return DEFAULT_API_BASE;
}

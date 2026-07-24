// Backend errors sometimes arrive as a JSON-encoded body, and job failures can carry a
// raw multi-line command dump (e.g. qpdf's stderr) as their message — this reduces
// either down to one short, user-readable line instead of dumping it straight to a toast.
export function friendlyErrorMessage(raw: string | undefined | null, fallback = 'Something went wrong'): string {
  if (!raw) return fallback;
  let text = raw.trim();
  try {
    const parsed = JSON.parse(text);
    text = parsed.message || parsed.error || text;
  } catch {
    // not JSON — use as-is
  }
  const firstLine = text.split('\n')[0].trim();
  if (!firstLine) return fallback;
  return firstLine.length > 140 ? firstLine.slice(0, 140) + '…' : firstLine;
}

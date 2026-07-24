import * as FileSystem from 'expo-file-system';

// Keyed by file uri, so it only survives across reopens for files with a stable path
// (i.e. anything already saved under FreeNoo's own storage) — a freshly-picked or
// shared-in PDF gets copied to a new cache path each time and won't have one to key by,
// which is an acceptable trade-off for keeping this file-based rather than adding a
// database just to remember page numbers.
const PROGRESS_FILE = FileSystem.documentDirectory + 'reading-progress.json';

async function readAll(): Promise<Record<string, number>> {
  const info = await FileSystem.getInfoAsync(PROGRESS_FILE);
  if (!info.exists) return {};
  try {
    const raw = await FileSystem.readAsStringAsync(PROGRESS_FILE);
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

export async function getLastPage(uri: string): Promise<number | null> {
  const all = await readAll();
  return all[uri] ?? null;
}

export async function setLastPage(uri: string, page: number): Promise<void> {
  const all = await readAll();
  all[uri] = page;
  await FileSystem.writeAsStringAsync(PROGRESS_FILE, JSON.stringify(all));
}

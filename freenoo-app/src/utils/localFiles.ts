import * as FileSystem from 'expo-file-system';
import * as IntentLauncher from 'expo-intent-launcher';
import { Platform } from 'react-native';

export interface LocalFile {
  uri: string;
  name: string;
  size: number;
  modifiedAt: number;
}

const MIME_TYPES: Record<string, string> = {
  pdf: 'application/pdf',
  zip: 'application/zip',
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  png: 'image/png',
  docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  pptx: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
};

export function mimeTypeFor(fileName: string): string {
  const ext = fileName.split('.').pop()?.toLowerCase() || 'pdf';
  return MIME_TYPES[ext] || 'application/octet-stream';
}

export function isPdf(fileName: string): boolean {
  return fileName.toLowerCase().endsWith('.pdf');
}

// A dedicated subfolder, not the app's whole document root — the root also holds
// unrelated system files (e.g. androidx profileinstaller artifacts) we don't want to
// show or let users delete.
const DIR = FileSystem.documentDirectory! + 'FreeNoo/';

async function ensureDir(): Promise<void> {
  const info = await FileSystem.getInfoAsync(DIR);
  if (!info.exists) await FileSystem.makeDirectoryAsync(DIR, { intermediates: true });
}

// Downloads a remote file into permanent local storage under a name that can't collide
// with earlier saves of the same tool (e.g. running "Merge PDF" twice in a row).
export async function saveFileLocally(remoteUrl: string, baseName: string): Promise<string> {
  await ensureDir();
  const dot = baseName.lastIndexOf('.');
  const stem = dot === -1 ? baseName : baseName.slice(0, dot);
  const ext = dot === -1 ? '' : baseName.slice(dot);
  const uniqueName = `${stem}-${Date.now()}${ext}`;
  const localUri = DIR + uniqueName;
  await FileSystem.downloadAsync(remoteUrl, localUri);
  return localUri;
}

export async function listLocalFiles(): Promise<LocalFile[]> {
  await ensureDir();
  const names = await FileSystem.readDirectoryAsync(DIR);
  const files: LocalFile[] = [];
  for (const name of names) {
    const info = await FileSystem.getInfoAsync(DIR + name, { size: true });
    if (info.exists && !info.isDirectory) {
      files.push({ uri: info.uri, name, size: info.size || 0, modifiedAt: info.modificationTime || 0 });
    }
  }
  return files.sort((a, b) => b.modifiedAt - a.modifiedAt);
}

export async function deleteLocalFile(uri: string): Promise<void> {
  await FileSystem.deleteAsync(uri, { idempotent: true });
}

export async function clearLocalFiles(): Promise<void> {
  await ensureDir();
  const names = await FileSystem.readDirectoryAsync(DIR);
  for (const name of names) await FileSystem.deleteAsync(DIR + name, { idempotent: true });
}

// Renames a file in place, preserving its original extension regardless of what's
// typed, so a rename can never accidentally change the file's type.
export async function renameLocalFile(uri: string, newBaseName: string): Promise<string> {
  const oldName = uri.split('/').pop() || '';
  const dot = oldName.lastIndexOf('.');
  const ext = dot === -1 ? '' : oldName.slice(dot);
  const cleanBase = newBaseName.trim().replace(/[/\\]/g, '');
  if (!cleanBase) throw new Error('File name cannot be empty');
  const newUri = DIR + cleanBase + ext;
  await FileSystem.moveAsync({ from: uri, to: newUri });
  return newUri;
}

// Opens a file with whatever app the device has for its type (PDF reader, Word, image
// viewer, etc.) via ACTION_VIEW — the standard Android "open with" flow, as opposed to
// shareAsync's "send to another app" flow. Files here live in the app's private sandbox,
// so we grant temporary read access to the target app via a FileProvider content:// URI
// (FLAG_GRANT_READ_URI_PERMISSION) rather than the raw file:// path, which other apps
// can't read.
export async function previewFile(uri: string, fileName: string): Promise<void> {
  if (Platform.OS !== 'android') {
    throw new Error('Preview is only supported on Android right now.');
  }
  const contentUri = await FileSystem.getContentUriAsync(uri);
  await IntentLauncher.startActivityAsync('android.intent.action.VIEW', {
    data: contentUri,
    flags: 1, // FLAG_GRANT_READ_URI_PERMISSION
    type: mimeTypeFor(fileName),
  });
}

const PREVIEW_CACHE_DIR = FileSystem.cacheDirectory! + 'preview/';

// react-native-pdf's native Android renderer can't read content:// URIs directly —
// only real file paths. expo-document-picker (and some other pickers) hand back
// content:// URIs from Android's document picker/SAF, which work fine for uploads
// (expo-file-system reads them fine) but silently fail to render in the PDF viewer.
// This copies such a file into the cache directory first if it isn't already a
// file:// path, so the viewer always gets something it can actually open.
export async function ensurePreviewableUri(uri: string, fileName: string): Promise<string> {
  if (uri.startsWith('file://')) return uri;
  const dir = PREVIEW_CACHE_DIR;
  const info = await FileSystem.getInfoAsync(dir);
  if (!info.exists) await FileSystem.makeDirectoryAsync(dir, { intermediates: true });
  const dest = dir + Date.now() + '-' + fileName;
  await FileSystem.copyAsync({ from: uri, to: dest });
  return dest;
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

// Files saved via saveFileLocally() live in the app's private sandbox — invisible to
// the phone's file manager or Downloads app. This copies one out to a public location
// the user picks (typically Downloads) via Android's Storage Access Framework, which is
// the only way to write into public storage under Android 10+ scoped storage without a
// broad, Play-Store-unfriendly storage permission. Resets each app launch (no persistence
// yet), so it may re-prompt for a folder once per session.
let cachedPublicDir: string | null = null;

export async function saveToPublicDownloads(localUri: string, fileName: string): Promise<void> {
  if (Platform.OS !== 'android') {
    throw new Error('Saving to Downloads is only supported on Android right now.');
  }
  const SAF = FileSystem.StorageAccessFramework;
  if (!cachedPublicDir) {
    const perm = await SAF.requestDirectoryPermissionsAsync();
    if (!perm.granted) throw new Error('Permission to save was denied.');
    cachedPublicDir = perm.directoryUri;
  }
  const content = await FileSystem.readAsStringAsync(localUri, { encoding: FileSystem.EncodingType.Base64 });
  const destUri = await SAF.createFileAsync(cachedPublicDir, fileName, mimeTypeFor(fileName));
  await FileSystem.writeAsStringAsync(destUri, content, { encoding: FileSystem.EncodingType.Base64 });
}

import { create } from 'zustand';

interface AppStore {
  // Processing
  isProcessing: boolean;
  processingMessage: string;
  processingProgress: number;
  setProcessing: (val: boolean, msg?: string) => void;
  setProgress: (val: number) => void;

  // Toast
  toast: { message: string; type: 'success' | 'error' | 'info' } | null;
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  hideToast: () => void;

  // Settings
  notificationsEnabled: boolean;
  setNotificationsEnabled: (val: boolean) => void;
  themeMode: 'dark' | 'light';
  setThemeMode: (val: 'dark' | 'light') => void;
}

export const useAppStore = create<AppStore>((set, get) => ({
  isProcessing: false,
  processingMessage: '',
  processingProgress: 0,
  setProcessing: (val, msg = '') => set({ isProcessing: val, processingMessage: msg, processingProgress: 0 }),
  setProgress: (val) => set({ processingProgress: val }),

  toast: null,
  showToast: (message, type = 'info') => {
    // "Processing updates" notifications can be turned off in Settings — but
    // errors always surface, since those are needed to use the app at all.
    if (type === 'success' && !get().notificationsEnabled) return;
    set({ toast: { message, type } });
    setTimeout(() => set({ toast: null }), 3000);
  },
  hideToast: () => set({ toast: null }),

  notificationsEnabled: true,
  setNotificationsEnabled: (val) => set({ notificationsEnabled: val }),

  themeMode: 'dark',
  setThemeMode: (val) => set({ themeMode: val }),
}));

import { useAppStore } from '../store';
import { darkTheme, lightTheme } from './index';

export function useTheme() {
  const mode = useAppStore(s => s.themeMode);
  return mode === 'light' ? lightTheme : darkTheme;
}

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type Theme = 'lavallejaLight' | 'lavallejaDark';

interface ThemeState {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      theme: 'lavallejaLight',
      toggleTheme: () => {
        const next = get().theme === 'lavallejaLight' ? 'lavallejaDark' : 'lavallejaLight';
        document.documentElement.setAttribute('data-theme', next);
        set({ theme: next });
      },
      setTheme: (theme) => {
        document.documentElement.setAttribute('data-theme', theme);
        set({ theme });
      },
    }),
    { name: 'lavalleja-theme' }
  )
);

import { Moon, Sun } from 'lucide-react';
import { useThemeStore } from '@/store/themeStore';

export function ThemeToggle() {
  const { theme, toggleTheme } = useThemeStore();
  const isDark = theme === 'lavallejaDark';

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="btn btn-ghost nav-icon-button"
      aria-label="Tema oscuro"
      aria-pressed={isDark}
    >
      {isDark ? <Sun className="size-5" aria-hidden="true" /> : <Moon className="size-5" aria-hidden="true" />}
    </button>
  );
}

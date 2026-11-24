import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const TEXT_SIZES = [100, 125, 150, 175, 200] as const;
type TextSize = (typeof TEXT_SIZES)[number];

interface AccessibilityState {
  textSize: TextSize;
  reduceMotion: boolean;
  setTextSize: (size: TextSize) => void;
  setReduceMotion: (reduce: boolean) => void;
}

export const useAccessibilityStore = create<AccessibilityState>()(
  persist(
    (set) => ({
      textSize: 100,
      reduceMotion: false,
      setTextSize: (textSize) => set({ textSize }),
      setReduceMotion: (reduceMotion) => set({ reduceMotion }),
    }),
    {
      name: 'lavalleja-accessibility',
      partialize: ({ textSize, reduceMotion }) => ({ textSize, reduceMotion }),
      merge: (saved, current) => {
        const settings = saved as Partial<AccessibilityState> | undefined;
        return {
          ...current,
          textSize: TEXT_SIZES.find((size) => size === settings?.textSize) ?? 100,
          reduceMotion: settings?.reduceMotion === true,
        };
      },
    },
  ),
);

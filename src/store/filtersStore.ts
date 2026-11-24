import { create } from 'zustand';
import type { ConcursoFilters } from '@/types';

interface FiltersState {
  filters: ConcursoFilters;
  setFilter: <K extends keyof ConcursoFilters>(key: K, value: ConcursoFilters[K]) => void;
  setFilters: (filters: Partial<ConcursoFilters>) => void;
  resetFilters: () => void;
}

const defaultFilters: ConcursoFilters = {
  page: 1,
  per_page: 12,
  sort_by: 'fecha_apertura',
  sort_order: 'desc',
};

export const useFiltersStore = create<FiltersState>()((set) => ({
  filters: { ...defaultFilters },
  setFilter: (key, value) =>
    set((state) => ({
      filters: { ...state.filters, [key]: value, page: key === 'page' ? (value as number) : 1 },
    })),
  setFilters: (partial) =>
    set((state) => ({ filters: { ...state.filters, ...partial, page: 1 } })),
  resetFilters: () => set({ filters: { ...defaultFilters } }),
}));

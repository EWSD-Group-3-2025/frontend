import { ColumnFiltersState } from '@tanstack/react-table';
import { create } from 'zustand';

interface Search {
	search: string;
	setSearch: (search: string) => void;
	columnFilters: ColumnFiltersState;
	setColumnFilters: (
		updater:
			| ColumnFiltersState
			| ((old: ColumnFiltersState) => ColumnFiltersState)
	) => void;
}

export const useSearch = create<Search>((set) => ({
	search: '',
	setSearch: (search: string) => set({ search }),
	columnFilters: [],
	setColumnFilters: (updater) =>
		set((state) => ({
			columnFilters:
				typeof updater === 'function'
					? updater(state.columnFilters)
					: updater,
		})),
}));

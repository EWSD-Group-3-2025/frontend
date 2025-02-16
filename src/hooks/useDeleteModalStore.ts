import { create } from 'zustand';

interface ModalStore {
	open: boolean;
	selectedId: number | null;
	setOpen: (open: boolean) => void;
	setSelectedId: (selectedId: number | null) => void;
}

export const useDeleteModalStore = create<ModalStore>((set) => ({
	open: false,
	selectedId: null,
	setOpen: (open: boolean) => set({ open: open }),
	setSelectedId: (selectedId: number | null) =>
		set({ selectedId: selectedId }),
}));

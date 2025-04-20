import { create } from 'zustand';

interface OpenBookMutationDialogStoreProps {
	isOpen: boolean;
	book?: Book | null;
	setIsOpen: ({
		isOpen,
		book,
	}: {
		isOpen: boolean;
		book?: Book | null;
	}) => void;
}

export const useOpenBookMutationDialogStore =
	create<OpenBookMutationDialogStoreProps>((set) => ({
		isOpen: false,
		book: null,
		setIsOpen: ({
			isOpen,
			book,
		}: {
			isOpen: boolean;
			book?: Book | null;
		}) => set({ isOpen, book }),
	}));

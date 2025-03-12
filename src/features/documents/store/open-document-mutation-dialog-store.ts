import { create } from 'zustand';

interface OpenDocumentMutationDialogStoreProps {
	isOpen: boolean;
	document?: any | null;
	setIsOpen: ({
		isOpen,
		document,
	}: {
		isOpen: boolean;
		document?: any | null;
	}) => void;
}

export const useOpenDocumentMutationDialogStore =
	create<OpenDocumentMutationDialogStoreProps>((set) => ({
		isOpen: false,
		document: null,
		setIsOpen: ({
			isOpen,
			document,
		}: {
			isOpen: boolean;
			document?: any | null;
		}) => set({ isOpen, document }),
	}));

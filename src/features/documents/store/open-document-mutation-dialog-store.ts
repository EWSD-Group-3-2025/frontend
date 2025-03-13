import { create } from 'zustand';
import { Document } from '../types';

interface OpenDocumentMutationDialogStoreProps {
	isOpen: boolean;
	document?: Document | null;
	setIsOpen: ({
		isOpen,
		document,
	}: {
		isOpen: boolean;
		document?: Document | null;
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
			document?: Document | null;
		}) => set({ isOpen, document }),
	}));

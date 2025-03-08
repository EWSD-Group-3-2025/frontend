import { create } from 'zustand';
import { Blog } from '../types';

interface OpenBlogMutationDialogStoreProps {
	isOpen: boolean;
	blog?: Blog | null;
	setIsOpen: ({
		isOpen,
		blog,
	}: {
		isOpen: boolean;
		blog?: Blog | null;
	}) => void;
}

export const useOpenBlogMutationDialogStore =
	create<OpenBlogMutationDialogStoreProps>((set) => ({
		isOpen: false,
		blog: null,
		setIsOpen: ({
			isOpen,
			blog,
		}: {
			isOpen: boolean;
			blog?: Blog | null;
		}) => set({ isOpen, blog }),
	}));

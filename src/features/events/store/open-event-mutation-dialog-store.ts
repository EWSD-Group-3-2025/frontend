import { create } from 'zustand';
import { Event } from '../types';

interface OpenEventMutationDialogStoreProps {
	isOpen: boolean;
	event?: Event | null;
	setIsOpen: ({
		isOpen,
		event,
	}: {
		isOpen: boolean;
		event?: Event | null;
	}) => void;
}

export const useOpenEventMutationDialogStore =
	create<OpenEventMutationDialogStoreProps>((set) => ({
		isOpen: false,
		event: null,
		setIsOpen: ({
			isOpen,
			event,
		}: {
			isOpen: boolean;
			event?: Event | null;
		}) => set({ isOpen, event }),
	}));

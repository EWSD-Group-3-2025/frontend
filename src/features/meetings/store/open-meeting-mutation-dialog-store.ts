import { create } from 'zustand';
import { Meeting } from '../types';

interface OpenMeetingMutationDialogStoreProps {
	isOpen: boolean;
	meeting?: Meeting | null;
	setIsOpen: ({
		isOpen,
		meeting,
	}: {
		isOpen: boolean;
		meeting?: Meeting | null;
	}) => void;
}

export const useOpenMeetingMutationDialogStore =
	create<OpenMeetingMutationDialogStoreProps>((set) => ({
		isOpen: false,
		meeting: null,
		setIsOpen: ({
			isOpen,
			meeting,
		}: {
			isOpen: boolean;
			meeting?: Meeting | null;
		}) => set({ isOpen, meeting }),
	}));

import { create } from 'zustand';

interface UserFormModalProps {
	isOpen: boolean;
	setIsOpen: (isOpen: boolean) => void;
}

export const useUserFormModal = create<UserFormModalProps>((set) => ({
	isOpen: false,
	setIsOpen: (isOpen: boolean) => set({ isOpen }),
}));

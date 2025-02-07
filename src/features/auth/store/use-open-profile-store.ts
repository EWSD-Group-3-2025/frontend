import { create } from 'zustand';

interface OpenProfileStoreProps {
	isOpen: boolean;
	setIsOpen: (isOpen: boolean) => void;
}

export const useOpenProfileStore = create<OpenProfileStoreProps>((set) => ({
	isOpen: false,
	setIsOpen: (isOpen: boolean) => set({ isOpen }),
}));

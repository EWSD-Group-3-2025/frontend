import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface WelcomeMessageStore {
	isFirstVisit: boolean;
	setIsFirstVisit: (value: boolean) => void;
}

export const useWelcomeMessageStore = create<WelcomeMessageStore>()(
	persist(
		(set) => ({
			isFirstVisit: true,
			setIsFirstVisit: (value: boolean) => set({ isFirstVisit: value }),
		}),
		{
			name: 'ewsd-welcome-message-store',
		}
	)
);

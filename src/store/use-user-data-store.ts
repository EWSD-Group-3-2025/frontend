import { AuthUser } from '@/features/users/types';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface UserStore {
	userData: AuthUser | undefined;
	setUserData: (user: AuthUser) => void;
	logOut: () => void;
}

export const userStore = create<UserStore>()(
	persist<UserStore>(
		(set) => ({
			userData: undefined,

			setUserData: (user: AuthUser) => set({ userData: user }),

			logOut: async () => {
				set(() => ({
					userData: undefined,
				}));

				localStorage.removeItem('userStore');
			},
		}),
		{
			name: 'userStore',
		}
	)
);

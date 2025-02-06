import Cookies from 'js-cookie';
import { createContext, useContext } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import CONSTANTS from '@/constants';
import { User } from '@/features/users/types';
import { getAuthAccount, logout as authLogout } from '@/features/auth/api';

interface AuthContextProps {
	user?: User | null;
	loading: boolean;
	login: (accessToken: string, refreshToken: string, user: User) => void;
	logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextProps | null>(null);

interface AuthProviderProps {
	children: React.ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
	const queryClient = useQueryClient();

	// Fetch the user details if a refresh token is present
	const {
		isLoading,
		data: userResponse,
		error,
	} = useQuery({
		queryKey: ['authUser'],
		queryFn: async () => await getAuthAccount(),
		retry: false,
	});

	const login = (accessToken: string, refreshToken: string, user: User) => {
		Cookies.set(CONSTANTS.ACCESS_TOKEN_KEY, accessToken, {
			expires: CONSTANTS.ACCESS_TOKEN_EXPIRE,
		});
		Cookies.set(CONSTANTS.REFRESH_TOKEN_KEY, refreshToken, {
			expires: CONSTANTS.REFRESH_TOKEN_EXPIRE,
		});

		queryClient.setQueryData(['authUser'], user);
	};

	const logoutMutation = useMutation({
		mutationFn: async () => await authLogout(),
		onSuccess: () => {
			Cookies.remove(CONSTANTS.ACCESS_TOKEN_KEY);
			Cookies.remove(CONSTANTS.REFRESH_TOKEN_KEY);
			queryClient.removeQueries({ queryKey: ['authUser'] });
		},
		onError: () => {
			queryClient.removeQueries({ queryKey: ['authUser'] });
		},
	});

	const logout = async () => {
		await logoutMutation.mutateAsync();
	};

	return (
		<AuthContext.Provider
			value={{
				user: !!userResponse
					? { ...userResponse.data.data.user }
					: null,
				loading: isLoading,
				login,
				logout,
			}}
		>
			{children}
		</AuthContext.Provider>
	);
};

export function useAuth() {
	const context = useContext(AuthContext);
	if (!context) {
		throw new Error('useAuth must be within an AuthProvider');
	}
	return context;
}

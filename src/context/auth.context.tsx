import Cookies from 'js-cookie';
import { createContext, useContext } from 'react';
import {
	useQuery,
	useMutation,
	useQueryClient,
	RefetchOptions,
	QueryObserverResult,
} from '@tanstack/react-query';
import CONSTANTS from '@/constants';
import { AuthUser } from '@/features/users/types';
import { getAuthAccount, logout as authLogout } from '@/features/auth/api';
import { toast } from 'sonner';
import { AxiosResponse } from 'axios';
import { getBrowserName, getPageName } from '@/utils';
import { useLocation } from 'react-router-dom';

interface AuthContextProps {
	user?: AuthUser | null;
	loading: boolean;
	assignLoginToken: (accessToken: string, refreshToken: string) => void;
	logout: () => Promise<void>;
	userDataRefresh: (options?: RefetchOptions) => Promise<
		QueryObserverResult<
			AxiosResponse<
				HTTPResponse<{
					user: AuthUser;
				}>,
				any
			>,
			Error
		>
	>;
}

const AuthContext = createContext<AuthContextProps | null>(null);

interface AuthProviderProps {
	children: React.ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
	const location = useLocation();
	const queryClient = useQueryClient();

	const browser = getBrowserName();
	const page = getPageName(location.pathname);

	const {
		isLoading,
		data: userResponse,
		refetch: userDataRefresh,
	} = useQuery({
		queryKey: ['authUser'],
		queryFn: async () =>
			await getAuthAccount(
				`routeName=${location.pathname}&browserName=${browser}&pageName=${page}`
			),
		retry: false,
		enabled: location.pathname !== '/login', // Will not call getAuthAccount for /login page
	});

	const logoutMutation = useMutation({
		mutationFn: async () => await authLogout(),
		onSuccess: () => {
			Cookies.remove(CONSTANTS.ACCESS_TOKEN_KEY);
			Cookies.remove(CONSTANTS.REFRESH_TOKEN_KEY);
			queryClient.removeQueries({ queryKey: ['authUser'] });
			toast.success('Logout successful');
		},
		onError: () => {
			queryClient.removeQueries({ queryKey: ['authUser'] });
			toast.success('Failed to logout');
		},
	});

	const assignLoginToken = (accessToken: string, refreshToken: string) => {
		Cookies.set(CONSTANTS.ACCESS_TOKEN_KEY, accessToken, {
			expires: CONSTANTS.ACCESS_TOKEN_EXPIRE,
		});
		Cookies.set(CONSTANTS.REFRESH_TOKEN_KEY, refreshToken, {
			expires: CONSTANTS.REFRESH_TOKEN_EXPIRE,
		});
	};

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
				assignLoginToken,
				logout,
				userDataRefresh,
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

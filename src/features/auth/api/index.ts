import Cookies from 'js-cookie';
import CONSTANTS from '@/constants';
import authRoutes from './routes';
import { User } from '@/features/users/types';
import api from '@/utils/axios';

export const login = async (body: LoginRequest) =>
	await api.post<HTTPResponse<LoginResponse>>(authRoutes.login, body);

export const logout = async () => await api.post(authRoutes.logout);

export const register = async (body: RegisterRequest) =>
	await api.post<HTTPResponse<boolean>>(authRoutes.register, body);

// Get authenticated user with access token and refresh token
export const getAuthAccount = async () => {
	const refreshToken = Cookies.get(CONSTANTS.REFRESH_TOKEN_KEY);
	if (!refreshToken) throw new Error('No refresh token found');
	return await api.get<HTTPResponse<{ user: User }>>(authRoutes.getMe);
};

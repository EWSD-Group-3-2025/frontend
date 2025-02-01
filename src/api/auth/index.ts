import authRoutes from '@/api/auth/routes';
import axios from '../';
import Cookies from 'js-cookie';
import CONSTANTS from '@/constants';
import { User } from '../user';

export const login = async (body: LoginRequest) =>
	await axios.post<HTTPResponse<LoginResponse>>(authRoutes.login, body);

export const logout = async () => await axios.post(authRoutes.logout);

export const register = async (body: RegisterRequest) =>
	await axios.post<HTTPResponse<boolean>>(authRoutes.register, body);

// Get authenticated user with access token and refresh token
export const getAuthAccount = async () => {
	const refreshToken = Cookies.get(CONSTANTS.REFRESH_TOKEN_KEY);
	if (!refreshToken) throw new Error('No refresh token found');
	return await axios.get<HTTPResponse<User>>('/api/auth/getMe');
};

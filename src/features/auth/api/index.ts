import Cookies from 'js-cookie';
import CONSTANTS from '@/constants';
import authRoutes from './routes';
import { AuthUser } from '@/features/users/types';
import api from '@/utils/axios';
import {
	ForgotPasswordRequest,
	LoginRequest,
	LoginResponse,
	ResetPasswordRequest,
	UpdateUserProfileRequest,
	VerifyOtpRequest,
} from '../types';

export const login = async (body: LoginRequest, params: string = '') =>
	await api.post<HTTPResponse<LoginResponse>>(
		`${authRoutes.login}?${params}`,
		body
	);

export const logout = async () => await api.post(authRoutes.logout);

// Get authenticated user with access token and refresh token
export const getAuthAccount = async (params: string = '') => {
	const refreshToken = Cookies.get(CONSTANTS.REFRESH_TOKEN_KEY);
	if (!refreshToken) throw new Error('No refresh token found');
	return await api.get<HTTPResponse<{ user: AuthUser }>>(
		`${authRoutes.getMe}?${params}`
	);
};

export const updateAuthAccount = async (body: UpdateUserProfileRequest) => {
	const refreshToken = Cookies.get(CONSTANTS.REFRESH_TOKEN_KEY);
	if (!refreshToken) throw new Error('No refresh token found');

	return await api.patch<HTTPResponse>(authRoutes.updateMe, body);
};

export const forgotPassword = async (body: ForgotPasswordRequest) =>
	await api.post<HTTPResponse>(authRoutes.forgotPassword, body);

export const verifyOtp = async (body: VerifyOtpRequest) =>
	await api.post<HTTPResponse>(authRoutes.verifyOtp, body);

export const resetPassword = async (body: ResetPasswordRequest) =>
	await api.post<HTTPResponse>(authRoutes.resetPassword, body);

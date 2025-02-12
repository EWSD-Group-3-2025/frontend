import Cookies from 'js-cookie';
import CONSTANTS from '@/constants';
import api from '@/utils/axios';
import { ChangePasswordRequest } from '../types';
import userRoutes from './routes';
import { UserFormValue } from '@/features/users/pages/admin/UserForm';
import { buildURL } from '@/utils';

export const userChangePassword = async (body: ChangePasswordRequest) => {
	const refreshToken = Cookies.get(CONSTANTS.REFRESH_TOKEN_KEY);
	if (!refreshToken) throw new Error('No refresh token found');

	return await api.post<HTTPResponse>(userRoutes.changePassword, body);
};

export const getAllUsers = async (params: string = '') =>
	await api.get(`${userRoutes.users}?${params}`);

export const createUser = async (body: UserFormValue) =>
	await api.post(userRoutes.users, body);

export const updateUser = async (id: number, body: UserFormValue) =>
	await api.put(buildURL(userRoutes.userId, { id }), body);

export const showUser = async (id: number) =>
	await api.get(buildURL(userRoutes.userId, { id }));

import Cookies from 'js-cookie';
import CONSTANTS from '@/constants';
import api from '@/utils/axios';
import { ChangePasswordRequest, User } from '../types';
import userRoutes from './routes';
import { buildURL } from '@/utils';
import { UserFormValue } from '@/features/users/components/user-form-modal';

export const userChangePassword = async (body: ChangePasswordRequest) => {
	const refreshToken = Cookies.get(CONSTANTS.REFRESH_TOKEN_KEY);
	if (!refreshToken) throw new Error('No refresh token found');

	return await api.post<HTTPResponse>(userRoutes.changePassword, body);
};

export const usernameExistsCount = async ({ name }: { name: string }) => {
	const refreshToken = Cookies.get(CONSTANTS.REFRESH_TOKEN_KEY);
	if (!refreshToken) throw new Error('No refresh token found');

	return await api.get<HTTPResponse<{ count: number }>>(
		`${userRoutes.usernameExists}?name=${name.trim()}`
	);
};

export const getAllUsers = async (params: string = '') =>
	await api.get<HTTPResponse<User[]>>(userRoutes.users.concat(`?${params}`));

export const createUser = async (body: UserFormValue) =>
	await api.post(userRoutes.users, body);

export const updateUser = async (id: number, body: UserFormValue) =>
	await api.put(buildURL(userRoutes.userId, { id }), body);

export const showUser = async (id: number) =>
	await api.get<HTTPResponse<UserFormValue>>(
		buildURL(userRoutes.userId, { id })
	);

export const deleteUser = async (id: number) =>
	await api.delete<HTTPResponse<boolean>>(
		buildURL(userRoutes.userId, { id })
	);

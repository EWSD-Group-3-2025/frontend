import Cookies from 'js-cookie';
import CONSTANTS from '@/constants';
import api from '@/utils/axios';
import { ChangePasswordRequest } from '../types';
import userRoutes from './routes';

export const userChangePassword = async (body: ChangePasswordRequest) => {
	const refreshToken = Cookies.get(CONSTANTS.REFRESH_TOKEN_KEY);
	if (!refreshToken) throw new Error('No refresh token found');

	return await api.post<HTTPResponse>(userRoutes.changePassword, body);
};

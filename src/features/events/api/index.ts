import Cookies from 'js-cookie';
import CONSTANTS from '@/constants';
import api from '@/utils/axios';
import { Event } from '../types';
import { EventCreateSchema } from '../components/event-mutation-dialog';
import eventRoutes from './routes';

export const getAll = async () => {
	const refreshToken = Cookies.get(CONSTANTS.REFRESH_TOKEN_KEY);
	if (!refreshToken) throw new Error('No refresh token found');

	return await api.get<HTTPResponse<Event[]>>(eventRoutes.baseUrl);
};

export const create = async (createRequest: EventCreateSchema) => {
	const refreshToken = Cookies.get(CONSTANTS.REFRESH_TOKEN_KEY);
	if (!refreshToken) throw new Error('No refresh token found');

	return await api.post<HTTPResponse>(eventRoutes.baseUrl, createRequest);
};

export const update = async (id: number, updateRequest: EventCreateSchema) => {
	const refreshToken = Cookies.get(CONSTANTS.REFRESH_TOKEN_KEY);
	if (!refreshToken) throw new Error('No refresh token found');

	return await api.patch<HTTPResponse>(
		`${eventRoutes.baseUrl}/${id}`,
		updateRequest
	);
};

export const deleteItem = async (id: number) => {
	const refreshToken = Cookies.get(CONSTANTS.REFRESH_TOKEN_KEY);
	if (!refreshToken) throw new Error('No refresh token found');

	return await api.delete<HTTPResponse>(`${eventRoutes.baseUrl}/${id}`);
};

import Cookies from 'js-cookie';
import CONSTANTS from '@/constants';
import api from '@/utils/axios';
import eventRoutes from './routes';
import { Event } from '@/features/events/types';
import { MeetingCreateSchema } from '../components/meeting-mutation-dialog';

export const getAll = async () => {
	const refreshToken = Cookies.get(CONSTANTS.REFRESH_TOKEN_KEY);
	if (!refreshToken) throw new Error('No refresh token found');

	return await api.get<HTTPResponse<Event[]>>(eventRoutes.baseUrl);
};

export const create = async (createRequest: MeetingCreateSchema) => {
	const refreshToken = Cookies.get(CONSTANTS.REFRESH_TOKEN_KEY);
	if (!refreshToken) throw new Error('No refresh token found');

	return await api.post<HTTPResponse>(eventRoutes.baseUrl, createRequest);
};

export const update = async (
	id: number,
	updateRequest: MeetingCreateSchema
) => {
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

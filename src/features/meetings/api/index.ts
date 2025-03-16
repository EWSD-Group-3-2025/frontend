import Cookies from 'js-cookie';
import CONSTANTS from '@/constants';
import api from '@/utils/axios';
import meetingRoutes from './routes';
import { MeetingCreateSchema } from '../components/meeting-mutation-dialog';
import { Meeting } from '../types';

export const getAll = async () => {
	const refreshToken = Cookies.get(CONSTANTS.REFRESH_TOKEN_KEY);
	if (!refreshToken) throw new Error('No refresh token found');

	return await api.get<HTTPResponse<Meeting[]>>(meetingRoutes.baseUrl);
};

export const create = async (createRequest: MeetingCreateSchema) => {
	const refreshToken = Cookies.get(CONSTANTS.REFRESH_TOKEN_KEY);
	if (!refreshToken) throw new Error('No refresh token found');

	return await api.post<HTTPResponse>(meetingRoutes.baseUrl, createRequest);
};

export const update = async (
	id: number,
	updateRequest: MeetingCreateSchema
) => {
	const refreshToken = Cookies.get(CONSTANTS.REFRESH_TOKEN_KEY);
	if (!refreshToken) throw new Error('No refresh token found');

	return await api.put<HTTPResponse>(
		`${meetingRoutes.baseUrl}/${id}`,
		updateRequest
	);
};

export const deleteItem = async (id: number) => {
	const refreshToken = Cookies.get(CONSTANTS.REFRESH_TOKEN_KEY);
	if (!refreshToken) throw new Error('No refresh token found');

	return await api.delete<HTTPResponse>(`${meetingRoutes.baseUrl}/${id}`);
};

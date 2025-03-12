import Cookies from 'js-cookie';
import CONSTANTS from '@/constants';
import api from '@/utils/axios';
import { Document } from '../types';
import documentRoutes from './routes';
import { DocumentCreateSchema } from '../components/document-mutation-dialog';

export const getAll = async () => {
	const refreshToken = Cookies.get(CONSTANTS.REFRESH_TOKEN_KEY);
	if (!refreshToken) throw new Error('No refresh token found');

	return await api.get<HTTPResponse<Document[]>>(
		documentRoutes.baseDocumentUrl
	);
};

export const create = async (createRequest: DocumentCreateSchema) => {
	const refreshToken = Cookies.get(CONSTANTS.REFRESH_TOKEN_KEY);
	if (!refreshToken) throw new Error('No refresh token found');

	return await api.post<HTTPResponse<Document>>(
		documentRoutes.baseDocumentUrl,
		createRequest
	);
};

export const update = async (
	id: number,
	updateRequest: DocumentCreateSchema
) => {
	const refreshToken = Cookies.get(CONSTANTS.REFRESH_TOKEN_KEY);
	if (!refreshToken) throw new Error('No refresh token found');

	return await api.patch<HTTPResponse>(
		`${documentRoutes.baseDocumentUrl}/${id}`,
		updateRequest
	);
};

export const deleteItem = async (id: number) => {
	const refreshToken = Cookies.get(CONSTANTS.REFRESH_TOKEN_KEY);
	if (!refreshToken) throw new Error('No refresh token found');

	return await api.delete<HTTPResponse>(
		`${documentRoutes.baseDocumentUrl}/${id}`
	);
};

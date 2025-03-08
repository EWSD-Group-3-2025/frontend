import Cookies from 'js-cookie';
import CONSTANTS from '@/constants';
import api from '@/utils/axios';
import blogRoutes from './routes';
import { Blog } from '../types';
import { BlogCreateSchema } from '../components/blog-mutation-dialog';

export const getBlogsForCurrentUser = async () => {
	const refreshToken = Cookies.get(CONSTANTS.REFRESH_TOKEN_KEY);
	if (!refreshToken) throw new Error('No refresh token found');

	return await api.get<HTTPResponse<Blog[]>>(
		blogRoutes.getBlogsForCurrentAuthUser
	);
};

export const getBlogsByCurrentUser = async () => {
	const refreshToken = Cookies.get(CONSTANTS.REFRESH_TOKEN_KEY);
	if (!refreshToken) throw new Error('No refresh token found');

	return await api.get<HTTPResponse<Blog[]>>(
		blogRoutes.getBlogsByCurrentAuthUser
	);
};

export const createNewBlog = async (blogCreateBody: BlogCreateSchema) => {
	const refreshToken = Cookies.get(CONSTANTS.REFRESH_TOKEN_KEY);
	if (!refreshToken) throw new Error('No refresh token found');

	return await api.post<HTTPResponse>(blogRoutes.create, blogCreateBody);
};

export const updateBlog = async (
	blogId: number,
	blogCreateBody: BlogCreateSchema
) => {
	const refreshToken = Cookies.get(CONSTANTS.REFRESH_TOKEN_KEY);
	if (!refreshToken) throw new Error('No refresh token found');

	return await api.patch<HTTPResponse>(
		`${blogRoutes.create}/${blogId}`,
		blogCreateBody
	);
};

export const deleteBlog = async (blogId: number) => {
	const refreshToken = Cookies.get(CONSTANTS.REFRESH_TOKEN_KEY);
	if (!refreshToken) throw new Error('No refresh token found');

	return await api.delete<HTTPResponse>(`${blogRoutes.create}/${blogId}`);
};

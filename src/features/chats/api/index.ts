import Cookies from 'js-cookie';
import CONSTANTS from '@/constants';
import api from '@/utils/axios';
import chatRoutes from './routes';
import { ChatRoom, ChatRoomMessage } from '../types';

export const chatRoomListsByUserId = async (userId: number) => {
	const refreshToken = Cookies.get(CONSTANTS.REFRESH_TOKEN_KEY);
	if (!refreshToken) throw new Error('No refresh token found');

	return await api.get<HTTPResponse<ChatRoom[]>>(
		`${chatRoutes.chatRoomListsByUserId}?userId=${userId}`
	);
};

export const messagesForChatRoom = async (chatRoomId: number) => {
	const refreshToken = Cookies.get(CONSTANTS.REFRESH_TOKEN_KEY);
	if (!refreshToken) throw new Error('No refresh token found');

	return await api.get<HTTPResponse<ChatRoomMessage[]>>(
		`${chatRoutes.messagesForChatRoom}/${chatRoomId}/messages`
	);
};

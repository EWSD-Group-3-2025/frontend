import { USER_ROLE } from '@/constants';

export interface ChatRoom {
	chatRoomId: number;
	currentUserId: number;
	currentUserName: string;
	receiverId: number;
	receiverName: string;
	roomKey: string;
}

export interface ChatRoomMessage {
	chatRoomId: number;
	content: string;
	id: number;
	senderId: number;
	senderUsername: string;
	timestamp: Date;
}

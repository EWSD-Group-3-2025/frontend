import { USER_ROLE } from '@/constants';

export interface Document {
	id: number;
	title: string;
	userId: number;
	fileUrl: string;
	entityType: number;
	fileType: string;
	storedName: string;
	storedUUID: number;
	description: string;
	createdAt: Date;
	updatedAt: Date;
}

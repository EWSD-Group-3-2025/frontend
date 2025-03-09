import { USER_ROLE } from '@/constants';

export interface Blog {
	id: number;
	title: string;
	authorName: string;
	content: string;
	commentList: Comment[];
	reactList: Reaction[];
	createdAt: Date;
	updatedAt: Date;
	authorId: number;
}

export interface Comment {
	commentText: string;
	commenterName: string;
	createdAt: Date;
	id: number;
	commenterId: number;
	updatedAt: Date;
}

export interface Reaction {
	react: string;
	authorName: string;
	authorId: number;

	createdAt: Date;
	id: number;
	entityId: number;
	entityType: number;
	updatedAt: Date;
}

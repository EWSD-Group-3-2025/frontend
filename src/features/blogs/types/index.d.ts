import { USER_ROLE } from '@/constants';

export interface Blog {
	id: number;
	title: string;
	authorName: string;
	content: string;
	commentList: Comment[];
	createdAt: Date;
	updatedAt: Date;
}

export interface Comment {
	commentText: string;
	commenterName: string;
	createdAt: Date;
	id: number;
	updatedAt: Date;
}

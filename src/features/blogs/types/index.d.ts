import { USER_ROLE } from '@/constants';

export interface Blog {
	id: number;
	title: string;
	authorName: string;
	content: string;
	commentList: [];
	createdAt: Date;
	updatedAt: Date;
}

import { USER_ROLE } from '@/constants';

export interface Event {
	id: number;
	title: string;
	tutorId: number;
	tutorName?: string;
	description: string;
	startdate: Date;
	enddate: Date;
	createdAt: Date;
	updatedAt: Date;
}

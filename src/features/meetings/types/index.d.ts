import { USER_ROLE } from '@/constants';

export interface MeetingMember {
	userId: number;
	email: string;
	name: string;
	roleName: string;
}

export interface Meeting {
	id: number;
	location: string;
	link: string;
	meetingType: number;
	description: string;
	meetingMembers: MeetingMember[];
	startTime: Date;
	endTime: Date;
}

export enum MeetingType {
	'VIRTUAL' = 1,
	'IN_PERSON' = 2,
}

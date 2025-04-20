import { students } from '@/data';
import { AdminDashboard } from '@/features/users/pages/management/Dashboard';
import { USER_ROLE } from '@/constants';
import { Meeting } from '@/features/meetings/types';

export interface User {
	id: number;
	name: string;
	username: string;
	email: string;
	status: boolean;
	gender: 1 | 2 | 3;
	roleId: 1 | 2 | 3 | 4;
	roleName: keyof typeof USER_ROLE;
	createdAt: string;
}

export interface AdminStaffUser extends User {
	departmentId: number | null;
	departmentName: string | null;
}

export interface StudentUser extends User {
	courseId: number | null;
	courseName: string | null;
	allocateTutorId: number | null;
	inactive: boolean;
	inactiveDays: number;
}

export interface TutorDashboard {
	students: StudentUser[];
	tutorDashboardCount: {
		newMessageCountForToday: number;
		meetingCountForToday: number;
		documentCountForToday: number;
	};
	dashboardTodayMeetings: Meeting[];
}

export interface StudentDashboard {
	tutorDto: TutorUser | null;
	dashboardTodayMeetings: Meeting[];
	studentDashboardCount: {
		newMessageCountForToday: number;
		meetingCountForToday: number;
		eventCountForToday: number;
	};
	dashboardChatMessages: {
		senderUsername: string;
		content: string;
		timestamp: string;
	}[];
}

export interface TutorUser extends User {
	specializationId: number | null;
	specializationName: string | null;
}
export interface AuthUser {
	courseId: number | null;
	courseName: string | null;
	departmentId: number | null;
	departmentName: string | null;
	firstTimeLogin: boolean;
	email: string;
	id: number;
	name: string;
	roleId?: number | undefined;
	roleName: USER_ROLE;
	specializationId: number | null;
	specializationName: string | null;
	status: boolean;
	username: string;
}

export interface ChangePasswordRequest {
	oldPassword: string;
	newPassword: string;
}

export interface AdminDashboard {
	totalUsers: number;
	assignedStudents: number;
	activeTutors: number;
	totalMessages: number;
	increaseThisMonthCount: number;
}

export interface MostBrowserUsagePieChart {
	browserName: string;
	uniqueUserCount: number;
}

export interface MostViewedPage {
	pageName: string;
	visitCount: number;
}

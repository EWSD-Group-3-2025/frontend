import { USER_ROLE } from '@/constants';

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
}

export interface TutorUser extends User {
	specializationId: number | null;
	specializationName: string | null;
}
export interface AuthUser {
	id: number;
	name: string;
	username: string;
	email: string;
	roleName: keyof typeof USER_ROLE;
}

export interface ChangePasswordRequest {
	oldPassword: string;
	newPassword: string;
}

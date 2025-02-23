import { USER_ROLE } from '@/constants';

export interface User {
	id: number;
	name: string;
	username: string;
	email: string;
	status: boolean;
	roleId: 1 | 2 | 3 | 4;
	roleName: keyof typeof USER_ROLE;
	createdAt: string;
}

export interface AdminStaffUser extends User {
	departmentId: number | null;
	department: string | null;
}

export interface StudentUser extends User {
	courseId: number | null;
	course: string | null;
}

export interface TutorUser extends User {
	specializationId: number | null;
	specialization: string | null;
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

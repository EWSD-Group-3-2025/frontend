import { USER_ROLE } from '@/constants';

export interface User {
	id: number;
	name: string;
	username: string;
	email: string;
	roleName: keyof typeof USER_ROLE;
	status: boolean;
	permissions: string | null;
	department: string | null;
	specialization: string | null;
	course: string | null;
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

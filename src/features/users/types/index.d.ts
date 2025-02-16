export interface User {
	id: string;
	name: string;
	username: string;
	email: string;
	roleName: string;
}

export interface ChangePasswordRequest {
	oldPassword: string;
	newPassword: string;
}

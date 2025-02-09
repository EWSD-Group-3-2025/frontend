export interface User {
	id: string;
	name: string;
	username: string;
	email: string;
}

export interface ChangePasswordRequest {
	oldPassword: string;
	newPassword: string;
}

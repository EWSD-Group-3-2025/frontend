import { AuthUser } from '@/features/users/types';

interface UpdateUserProfileRequest {
	username: string;
	name: string;
}

interface ForgotPasswordRequest {
	email: string;
}

interface VerifyOtpRequest {
	otp: string;
}

interface ResetPasswordRequest {
	newPassword: string;
	confirmPassword: string;
}

interface LoginRequest {
	email: string;
	password: string;
}

interface LoginResponse {
	accessToken: string;
	refreshToken: string;
	user: AuthUser;
}

interface RegisterRequest {
	name: string;
	email: string;
	password: string;
	confirmationPassword: string;
}

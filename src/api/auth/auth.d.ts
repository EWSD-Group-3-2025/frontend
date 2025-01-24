interface LoginRequest {
	email: string;
	password: string;
}

interface LoginResponse {
	accessToken: string;
	refreshToken: string;
}

interface RegisterRequest {
	userName: string;
	email: string;
	password: string;
	confirmationPassword: string;
}

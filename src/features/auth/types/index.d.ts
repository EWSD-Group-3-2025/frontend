interface LoginRequest {
	email: string;
	password: string;
}

interface LoginResponse {
	accessToken: string;
	refreshToken: string;
}

interface RegisterRequest {
	name: string;
	email: string;
	password: string;
	confirmationPassword: string;
}

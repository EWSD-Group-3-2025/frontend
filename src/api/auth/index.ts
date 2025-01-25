import authRoutes from '@/api/auth/routes';
import axios from '../';

export const login = async (body: LoginRequest) =>
	await axios.post<HTTPResponse<LoginResponse>>(authRoutes.login, body);

export const logout = async () => await axios.post(authRoutes.logout);

export const register = async (body: RegisterRequest) =>
	await axios.post<HTTPResponse<boolean>>(authRoutes.register, body);

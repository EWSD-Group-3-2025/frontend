import authRoutes from '@/api/auth/routes';
import axios from '../';

export const login = async (body: LoginRequest) =>
	await axios.post(authRoutes.login, body);

export const logout = async () => await axios.post(authRoutes.logout);

export const register = async (body: RegisterRequest) =>
	await axios.post(authRoutes.register, body);

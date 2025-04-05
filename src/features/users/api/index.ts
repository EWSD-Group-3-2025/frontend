import { TransferStudentFormValue } from './../components/transfer-student-modal';
import Cookies from 'js-cookie';
import CONSTANTS from '@/constants';
import api from '@/utils/axios';
import {
	AdminDashboard,
	ChangePasswordRequest,
	MostBrowserUsagePieChart,
	MostViewedPage,
	StudentDashboard,
	StudentUser,
	TutorDashboard,
	User,
} from '../types';
import { userRoutes, allocationRoutes, dashboardRoutes } from './routes';
import { buildURL } from '@/utils';
import { UserFormValue } from '@/features/users/components/user-form-modal';
import { AllocateTutor } from '@/features/users/components/allocate-tutor';

export const userChangePassword = async (body: ChangePasswordRequest) => {
	const refreshToken = Cookies.get(CONSTANTS.REFRESH_TOKEN_KEY);
	if (!refreshToken) throw new Error('No refresh token found');

	return await api.post<HTTPResponse>(userRoutes.changePassword, body);
};

export const usernameExistsCount = async ({ name }: { name: string }) => {
	const refreshToken = Cookies.get(CONSTANTS.REFRESH_TOKEN_KEY);
	if (!refreshToken) throw new Error('No refresh token found');

	return await api.get<HTTPResponse<{ count: number }>>(
		`${userRoutes.usernameExists}?name=${name.trim()}`
	);
};

export const getAllUsers = async (params: string = '') =>
	await api.get<HTTPResponse<User[]>>(userRoutes.users.concat(`?${params}`));

export const createUser = async (body: UserFormValue) =>
	await api.post(userRoutes.users, body);

export const updateUser = async (id: number, body: UserFormValue) =>
	await api.patch(buildURL(userRoutes.userId, { id }), body);

export const showUser = async (id: number) =>
	await api.get<HTTPResponse<UserFormValue>>(
		buildURL(userRoutes.userId, { id })
	);

export const deleteUser = async (id: number) =>
	await api.delete<HTTPResponse<boolean>>(
		buildURL(userRoutes.userId, { id })
	);

export const resetPasswordByAdmin = async () =>
	await api.post(userRoutes.resetPasswordByAdmin);

export const allocation = async (body: AllocateTutor) =>
	await api.post(allocationRoutes.allocation, body);

export const deallocation = async (params: string = '') =>
	await api.delete(allocationRoutes.deallocation.concat(`?${params}`));

export const transferStudent = async (body: TransferStudentFormValue) =>
	await api.post<HTTPResponse<boolean>>(
		allocationRoutes.transferStudents,
		body
	);

export const getTutorAllocationStudents = async (id: number) =>
	await api.get<HTTPResponse<StudentUser[]>>(
		buildURL(allocationRoutes.getTutorAllocationStudents, { id })
	);

export const getAdminDashboard = async () =>
	await api.get<HTTPResponse<AdminDashboard>>(dashboardRoutes.adminDashboard);

export const getStudentDashboard = async (id: number) =>
	await api.get<HTTPResponse<StudentDashboard>>(
		buildURL(dashboardRoutes.studentDashboard, { id })
	);

export const getTutorDashboard = async (id: number) =>
	await api.get<HTTPResponse<TutorDashboard>>(
		buildURL(dashboardRoutes.tutorDashboard, { id })
	);

export const getBrowserCount = async () =>
	await api.get<HTTPResponse<MostBrowserUsagePieChart[]>>(
		dashboardRoutes.browserCount
	);

export const getMostViewedPages = async () =>
	await api.get<HTTPResponse<MostViewedPage[]>>(
		dashboardRoutes.mostViewedPages
	);

export const getUnassignStudentList = async () =>
	await api.get<HTTPResponse<StudentUser[]>>(dashboardRoutes.unassignStudent);

export const getMostActiveUsers = async () =>
	await api.get<HTTPResponse<User[]>>(dashboardRoutes.mostActiveUser);

export const getInactivityStudents = async () =>
	await api.get(dashboardRoutes.inactivityStudents);

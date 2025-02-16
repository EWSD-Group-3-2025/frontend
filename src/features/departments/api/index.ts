import routes from '@/features/departments/api/routes';
import { DepartmentCreateForm } from '@/features/departments/pages/DepartmentList';
import { buildURL } from '@/utils';
import api from '@/utils/axios';

export const getAllDepartments = async () =>
	await api.get<HTTPResponse<Department[]>>(routes.departments);

export const createDepartment = async (body: DepartmentCreateForm) =>
	await api.post<HTTPResponse<boolean>>(routes.departments, body);

export const updateDepartment = async (id: number, body: Department) =>
	await api.put<HTTPResponse<boolean>>(
		buildURL(routes.departmentId, { id }),
		body
	);

export const showDepartment = async (id: number) =>
	await api.get<HTTPResponse<Department>>(
		buildURL(routes.departmentId, { id })
	);

export const deleteDepartment = async (id: number) =>
	await api.delete<HTTPResponse<boolean>>(
		buildURL(routes.departmentId, { id })
	);

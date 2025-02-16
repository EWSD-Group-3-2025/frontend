import routes from '@/features/departments/api/routes';
import api from '@/utils/axios';

export const getAllDepartments = async () => await api.get(routes.departments);

export const createDepartment = async (body: DepartmentForm) =>
	await api.post(routes.departments, body);

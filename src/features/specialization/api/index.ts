import { SpecializationCreateForm } from '@/features/specialization/pages/SpecializationList';
import { buildURL } from '@/utils';
import api from '@/utils/axios';
import routes from '@/features/specialization/api/routes';

export const getAllSpecializations = async () =>
	await api.get<HTTPResponse<Specialization[]>>(routes.specializations);

export const createSpecialization = async (body: SpecializationCreateForm) =>
	await api.post<HTTPResponse<boolean>>(routes.specializations, body);

export const updateSpecialization = async (id: number, body: Department) =>
	await api.put<HTTPResponse<boolean>>(
		buildURL(routes.specializationId, { id }),
		body
	);

export const showSpecialization = async (id: number) =>
	await api.get<HTTPResponse<Specialization>>(
		buildURL(routes.specializationId, { id })
	);

export const deleteSpecialization = async (id: number) =>
	await api.delete<HTTPResponse<boolean>>(
		buildURL(routes.specializationId, { id })
	);

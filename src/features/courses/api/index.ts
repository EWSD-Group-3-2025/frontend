import routes from '@/features/courses/api/routes';
import { buildURL } from '@/utils';
import api from '@/utils/axios';

export const getAllCourses = async () =>
	await api.get<HTTPResponse<Course[]>>(routes.courses);

export const createCourse = async (body: CourseForm) =>
	await api.post<HTTPResponse<boolean>>(routes.courses, body);

export const updateCourse = async (id: number, body: Course) =>
	await api.put<HTTPResponse<boolean>>(
		buildURL(routes.courseId, { id }),
		body
	);

export const showCourse = async (id: number) =>
	await api.get<HTTPResponse<Course>>(buildURL(routes.courseId, { id }));

export const deleteCourse = async (id: number) =>
	await api.delete<HTTPResponse<boolean>>(buildURL(routes.courseId, { id }));

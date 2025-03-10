const userRoutes = {
	changePassword: '/v1/users/change-password',
	usernameExists: '/v1/users/name-exists',
	users: '/v1/users',
	userId: '/v1/users/${id}',
	allocation: '/v1/allocations',
	deallocationStudents: '/v1/allocations/deallocate-students',
	resetPasswordByAdmin: '/v1/users/reset-password',
	adminDashboard: '/v1/admin/dashboard',
	studentDashboard: '/v1/student/dashboard/${id}',
	tutorDashboard: '/v1/tutor/dashboard/${id}',
	browserCount: '/v1/admin/report/browser-count',
	mostViewedPages: '/v1/admin/report/top-routes',
};

export default userRoutes;

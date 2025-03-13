export const userRoutes = {
	changePassword: '/v1/users/change-password',
	usernameExists: '/v1/users/name-exists',
	users: '/v1/users',
	userId: '/v1/users/${id}',
	resetPasswordByAdmin: '/v1/users/reset-password',
};

export const allocationRoutes = {
	allocation: '/v1/allocations',
	deallocationStudents: '/v1/allocations/deallocate-students',
	transferStudent: '/v1/allocations/transfer',
};

export const dashboardRoutes = {
	adminDashboard: '/v1/admin/dashboard',
	studentDashboard: '/v1/student/dashboard/${id}',
	tutorDashboard: '/v1/tutor/dashboard/${id}',
	unassignStudent: '/v1/admin/dashboard/get-unassigned-students',
	browserCount: '/v1/admin/report/browser-count',
	mostViewedPages: '/v1/admin/report/top-routes',
	mostActiveUser: '/v1/admin/report/most-active-users',
	inactivityStudents: '/v1/admin/report/inactivity-users-betweendates',
};

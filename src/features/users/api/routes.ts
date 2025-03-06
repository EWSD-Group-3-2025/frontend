const userRoutes = {
	changePassword: '/v1/users/change-password',
	usernameExists: '/v1/users/name-exists',
	users: '/v1/users',
	userId: '/v1/users/${id}',
	allocation: '/v1/allocations',
	deallocationStudents: '/v1/allocations/deallocate-students',
	resetPasswordByAdmin: '/v1/users/reset-password',
};

export default userRoutes;

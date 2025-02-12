const CONSTANTS = {
	ACCESS_TOKEN_KEY: 'EWSD_accessToken',
	ACCESS_TOKEN_EXPIRE: 15 / (24 * 60), // 15 minutes in days
	REFRESH_TOKEN_KEY: 'EWSD_refreshToken',
	REFRESH_TOKEN_EXPIRE: 7, // 7 days
};

export enum USER_ROLE {
	STUDENT = 'STUDENT',
	ADMIN = 'ADMIN',
	TUTOR = 'TUTOR',
	STAFF = 'STAFF',
}

export const USER_ROLES = Object.freeze({
	ADMIN: {
		value: 1,
		key: 'Admin',
		label: 'Admin',
	},
	STAFF: {
		value: 2,
		key: 'Staff',
		label: 'Staff',
	},
	STUDENT: {
		value: 3,
		key: 'Student',
		label: 'Student',
	},
	TUTOR: {
		value: 4,
		key: 'Tutor',
		label: 'Tutor',
	},
});

export const itemsPerPage = Object.freeze([
	{
		value: 10,
		label: '10/page',
	},
	{
		value: 15,
		label: '15/page',
	},
	{
		value: 25,
		label: '25/page',
	},
	{
		value: 50,
		label: '50/page',
	},
]);

export default CONSTANTS;

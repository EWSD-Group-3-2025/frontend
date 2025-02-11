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

export default CONSTANTS;

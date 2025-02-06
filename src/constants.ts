const CONSTANTS = {
	ACCESS_TOKEN_KEY: 'EWSD_accessToken',
	ACCESS_TOKEN_EXPIRE: 15 / (24 * 60), // 15 minutes in days
	REFRESH_TOKEN_KEY: 'EWSD_refreshToken',
	REFRESH_TOKEN_EXPIRE: 7, // 7 days
};

export enum USER_ROLE {
	STUDENT = 'STUDENT',
	TUTOR = 'TUTOR',
	STAFF = 'STAFF',
}

export default CONSTANTS;

import CONSTANTS, { USER_ROLE } from '@/constants';
import { AuthUser } from '@/features/users/types';
import Cookies from 'js-cookie';

export const hasAccess = ({
	user,
	allowedRoles,
}: {
	user: AuthUser;
	allowedRoles: USER_ROLE[];
}) => {
	return user && allowedRoles.includes(user.roleName);
};

export const getRedirectRoute = (role: USER_ROLE) => {
	switch (role) {
		case USER_ROLE.ADMIN:
		case USER_ROLE.STAFF:
			return '/dashboard/management';
		case USER_ROLE.STUDENT:
		case USER_ROLE.TUTOR:
			return '/dashboard/end-user';
		default:
			return '/';
	}
};

export const getAuthPathname = (role: USER_ROLE) => {
	switch (role) {
		case USER_ROLE.ADMIN:
		case USER_ROLE.STAFF:
			return 'management';
		case USER_ROLE.STUDENT:
		case USER_ROLE.TUTOR:
			return 'end-user';
		default:
			return '';
	}
};

export function isAuthDashboardPath({
	pathname,
	authPathname,
}: {
	pathname: string;
	authPathname: string;
}): boolean {
	// Create the regex dynamically using the `authPathname` parameter
	const regex = new RegExp(`^/dashboard/(${authPathname})(/.*)?$`);

	// Use the `test` method on the RegExp object
	return regex.test(pathname);
}

export function isNewUser() {
	return Number(Cookies.get(CONSTANTS.NEW_USER)) === 1;
}

export function setNewUserFlag() {
	Cookies.set(CONSTANTS.NEW_USER, '1');
}

export function removeNewUserFlag() {
	Cookies.remove(CONSTANTS.NEW_USER);
}

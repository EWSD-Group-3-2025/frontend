import { USER_ROLE } from '@/constants';
import { AuthUser } from '@/features/users/types';

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
			return '/dashboard/admin';
		case USER_ROLE.STAFF:
			return '/dashboard/staff';
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
			return 'admin';
		case USER_ROLE.STAFF:
			return 'staff';
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

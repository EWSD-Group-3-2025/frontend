import api from '@/utils/axios';
import { transformObjects, objectToArray } from '@/utils/dataUtils';
import { cn, buildURL, convertNameToSlug } from '@/utils/stringUtils';
import { getBrowserName } from '@/utils/getBrowserName';
import {
	isNewUser,
	hasAccess,
	setNewUserFlag,
	getAuthPathname,
	getRedirectRoute,
	removeNewUserFlag,
	isAuthDashboardPath,
} from '@/utils/auth';

export {
	api,
	cn,
	buildURL,
	hasAccess,
	isNewUser,
	objectToArray,
	getBrowserName,
	setNewUserFlag,
	getAuthPathname,
	transformObjects,
	getRedirectRoute,
	convertNameToSlug,
	removeNewUserFlag,
	isAuthDashboardPath,
};

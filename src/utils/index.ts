import {
	isNewUser,
	hasAccess,
	setNewUserFlag,
	getAuthPathname,
	getRedirectRoute,
	removeNewUserFlag,
	isAuthDashboardPath,
} from '@/utils/auth';
import {
	cn,
	buildURL,
	convertNameToSlug,
	getPageName,
} from '@/utils/stringUtils';
import api from '@/utils/axios';
import { getBrowserName } from '@/utils/getBrowserName';
import { transformObjects, objectToArray } from '@/utils/dataUtils';

export {
	api,
	cn,
	buildURL,
	hasAccess,
	isNewUser,
	getPageName,
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

import { appRouteList } from '@/router';
import { twMerge } from 'tailwind-merge';
import { clsx, type ClassValue } from 'clsx';
import { GENDER, MEETING, USER_ROLE } from '@/constants';

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export const getPageName = (pathname: string) => {
	return appRouteList.find((route) => route.path === pathname)?.name;
};

export function convertNameToSlug(name: string): string {
	return name
		.normalize('NFD') // Normalize to decomposed Unicode
		.replace(/[\u0300-\u036f]/g, '') // Remove diacritics (accents)
		.replace(/[^a-zA-Z0-9\s-]/g, '') // Remove non-ASCII characters except spaces and hyphens
		.trim() // Trim spaces from start and end
		.replace(/\s+/g, '-') // Replace spaces with hyphens
		.toLowerCase(); // Convert to lowercase
}

export const buildURL = <T extends Record<string, string | number>>(
	template: string,
	values: T
): string => {
	return template.replace(/\${(.*?)}/g, (_, key: string) => {
		return key in values ? String(values[key as keyof T]) : '';
	});
};

export const getGenderName = (genderId: number): string => {
	switch (genderId) {
		case GENDER.MALE.value:
			return GENDER.MALE.label;
		case GENDER.FEMALE.value:
			return GENDER.FEMALE.label;
		case GENDER.OTHER.value:
			return GENDER.OTHER.label;
		default:
			return 'Unknown';
	}
};

export const getMeetingType = (meetingType: number): string => {
	switch (meetingType) {
		case MEETING.VIRTUAL.value:
			return MEETING.VIRTUAL.label;
		case MEETING.INPRESON.value:
			return MEETING.INPRESON.label;
		default:
			return 'Unknown';
	}
};

export const getRoleColor = (status: string) => {
	switch (status) {
		case USER_ROLE.ADMIN:
			return 'bg-badge-admin hover:bg-badge-admin text-font';
		case USER_ROLE.STAFF:
			return 'bg-badge-staff hover:bg-badge-staff text-font';
		case USER_ROLE.STUDENT:
			return 'bg-badge-student hover:bg-badge-student dark:text-font-white';
		case USER_ROLE.TUTOR:
			return 'bg-badge-tutor hover:bg-badge-tutor text-font';
		default:
			return 'bg-secondary';
	}
};

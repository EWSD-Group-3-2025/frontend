import { appRouteList } from '@/router';
import { twMerge } from 'tailwind-merge';
import { clsx, type ClassValue } from 'clsx';

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

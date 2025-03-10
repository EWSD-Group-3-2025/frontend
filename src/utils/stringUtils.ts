import { appRouteList, Route } from '@/router';
import { twMerge } from 'tailwind-merge';
import { clsx, type ClassValue } from 'clsx';

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export const getPageName = (pathname: string): string | undefined => {
	const findRoute = (routes: Route[], path: string): string | undefined => {
		for (const route of routes) {
			if (route.path === path) return route.name;
			if (route.children) {
				const found = findRoute(route.children, path);
				if (found) return found;
			}
		}
		return undefined;
	};

	return findRoute(appRouteList, pathname);
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

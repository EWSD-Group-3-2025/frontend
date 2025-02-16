import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function convertNameToSlug(name: string): string {
	return name.toLowerCase().replace(/\s+/g, '-');
}

export const buildURL = <T extends Record<string, string | number>>(
	template: string,
	values: T
): string => {
	return template.replace(/\${(.*?)}/g, (_, key: string) => {
		return key in values ? String(values[key as keyof T]) : '';
	});
};

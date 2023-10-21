import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function isValidUsername(username: string) {
	return /^[a-z0-9-]{3,20}$/.test(username);
}

//  replaces spaces with dashes
export const kebabCase = (str: string) =>
	str.replace(/\s+/g, '-').toLowerCase();

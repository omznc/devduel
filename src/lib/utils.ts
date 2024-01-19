import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function isValidUsername(username: string) {
	return /^[a-zA-Z0-9]{3,20}$/.test(username);
}

export function isValidEmail(email: string) {
	return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function toSlug(text: string, unique = false) {
	let slug = text
		.toLowerCase()
		.replace(/[^\w ]+/g, "")
		.replace(/ +/g, "-");

	if (slug.length === 0) {
		slug = Math.random().toString(36).substring(2, 7);
	}

	if (!unique) return slug;

	return `${slug}-${Math.random().toString(36).substring(2, 7)}`;
}

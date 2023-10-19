import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { getServerSession } from 'next-auth';
import { authOptions } from '@app/api/auth/[...nextauth]/route.ts';

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function isValidUsername(username: string) {
	return /^[a-z0-9-]{3,20}$/.test(username);
}
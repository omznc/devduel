import { AvailableFormatInfo, FormatEnum } from 'sharp';

export const validSources: ValidSources = [
	'https://github.com',
	'https://gitlab.com',
	'https://bitbucket.org',
];

export const imageConfig: ImageConfig = {
	formats: ['image/png', 'image/jpeg', 'image/webp'],
	maxSize: 5_000_000,
	compression: {
		enabled: true,
		quality: 70,
		format: 'avif',
	},
};

// Types
interface ValidSources extends Array<string> {}

interface ImageConfig {
	formats: string[];
	maxSize: number;
	compression: {
		enabled: boolean;
		quality: number;
		format: keyof FormatEnum | AvailableFormatInfo;
	};
}

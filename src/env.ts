import { createEnv } from '@t3-oss/env-nextjs';
import { z } from 'zod';
import { AvailableFormatInfo, FormatEnum } from 'sharp';

// export const validSources: ValidSources = [
// 	'https://github.com',
// 	'https://gitlab.com',
// 	'https://bitbucket.org',
// ];
//
// export const imageConfig: ImageConfig = {
// 	formats: ['image/png', 'image/jpeg', 'image/webp'],
// 	maxSize: 5_000_000,
// 	compression: {
// 		enabled: true,
// 		quality: 70,
// 		format: 'avif',
// 	},
// };

const env = createEnv({
	// These are only visible to server-side code
	server: {
		DATABASE_URL: z
			.string({
				description: 'Postgres database URL',
			})
			.url({
				message: 'DATABASE_URL must be a valid URL (postgres://)',
			}),
		GITHUB_CLIENT_ID: z.string({
			description: 'Google OAuth Client ID',
		}),
		GITHUB_CLIENT_SECRET: z.string({
			description: 'Google OAuth Client Secret',
		}),
		NEXTAUTH_SECRET: z.string({
			description:
				'Secret used to sign next-auth tokens (https://generate-secret.vercel.app/32)',
		}),
		NEXTAUTH_URL: z
			.string({
				description:
					'The final, public-facing app URL. (http://localhost:3000 for local development, default)',
			})
			.default('http://localhost:3000'),
		BACKBLAZE_BUCKET_NAME: z.string({
			description: 'Backblaze B2 Bucket Name',
		}),
		BACKBLAZE_BUCKET_ENDPOINT: z.string({
			description: 'Backblaze B2 Bucket Endpoint',
		}),
		BACKBLAZE_BUCKET_REGION: z.string({
			description: 'Backblaze B2 Bucket Region',
		}),
		BACKBLAZE_APPLICATION_KEY_ID: z.string({
			description: 'Backblaze B2 Application Key ID',
		}),
		BACKBLAZE_APPLICATION_KEY: z.string({
			description: 'Backblaze B2 Application Key',
		}),
		BACKBLAZE_CDN_URL: z.string({
			description: 'Backblaze B2 CDN URL',
		}),
	},
	client: {
		NEXT_PUBLIC_CONFIG_VALID_SOURCES: z
			.array(
				z.string({
					description: 'Valid sources for image uploads',
				})
			)
			.default([
				'https://github.com',
				'https://gitlab.com',
				'https://bitbucket.org',
			]),
		NEXT_PUBLIC_CONFIG_IMAGE_FORMATS: z
			.array(
				z.string({
					description: 'Valid image formats',
				})
			)
			.default(['image/png', 'image/jpeg', 'image/webp']),
		NEXT_PUBLIC_CONFIG_IMAGE_MAX_SIZE: z
			.number({
				description: 'Maximum image size in bytes',
			})
			.default(5_000_000),
		NEXT_PUBLIC_CONFIG_IMAGE_COMPRESSION_ENABLED: z
			.boolean({
				description: 'Whether image compression is enabled',
			})
			.default(true),
		NEXT_PUBLIC_CONFIG_IMAGE_COMPRESSION_QUALITY: z
			.number({
				description: 'Image compression quality',
			})
			.default(70),
		NEXT_PUBLIC_CONFIG_IMAGE_COMPRESSION_FORMAT: z
			.string({
				description: 'Image compression format',
			})
			.default('avif') as z.ZodType<
			keyof FormatEnum | AvailableFormatInfo
		>,
	},
	runtimeEnv: {
		DATABASE_URL: process.env.DATABASE_URL,
		GITHUB_CLIENT_ID: process.env.GITHUB_CLIENT_ID,
		GITHUB_CLIENT_SECRET: process.env.GITHUB_CLIENT_SECRET,
		NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
		NEXTAUTH_URL: process.env.NEXTAUTH_URL,
		BACKBLAZE_BUCKET_NAME: process.env.BACKBLAZE_BUCKET_NAME,
		BACKBLAZE_BUCKET_REGION: process.env.BACKBLAZE_BUCKET_REGION,
		BACKBLAZE_BUCKET_ENDPOINT: process.env.BACKBLAZE_BUCKET_ENDPOINT,
		BACKBLAZE_APPLICATION_KEY_ID: process.env.BACKBLAZE_APPLICATION_KEY_ID,
		BACKBLAZE_APPLICATION_KEY: process.env.BACKBLAZE_APPLICATION_KEY,
		BACKBLAZE_CDN_URL: process.env.BACKBLAZE_CDN_URL,
		NEXT_PUBLIC_CONFIG_VALID_SOURCES: JSON.stringify(
			process.env.NEXT_PUBLIC_CONFIG_VALID_SOURCES
		),
		NEXT_PUBLIC_CONFIG_IMAGE_FORMATS: JSON.stringify(
			process.env.NEXT_PUBLIC_CONFIG_IMAGE_FORMATS
		),
		NEXT_PUBLIC_CONFIG_IMAGE_MAX_SIZE:
			process.env.NEXT_PUBLIC_CONFIG_IMAGE_MAX_SIZE,
		NEXT_PUBLIC_CONFIG_IMAGE_COMPRESSION_ENABLED:
			process.env.NEXT_PUBLIC_CONFIG_IMAGE_COMPRESSION_ENABLED,
		NEXT_PUBLIC_CONFIG_IMAGE_COMPRESSION_QUALITY:
			process.env.NEXT_PUBLIC_CONFIG_IMAGE_COMPRESSION_QUALITY,
		NEXT_PUBLIC_CONFIG_IMAGE_COMPRESSION_FORMAT:
			process.env.NEXT_PUBLIC_CONFIG_IMAGE_COMPRESSION_FORMAT,
	},
});

export default env;

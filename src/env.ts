import { createEnv } from '@t3-oss/env-nextjs';
import { z } from 'zod';

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
	client: {},
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
	},
});

export default env;

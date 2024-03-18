import { DeleteObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import env from "@env";
import { isAuthorized } from "@lib/server-utils.ts";
import { getCurrentTask } from "@lib/task.ts";

const s3 = new S3Client({
	endpoint: env.BACKBLAZE_BUCKET_ENDPOINT,
	region: env.BACKBLAZE_BUCKET_REGION,
	credentials: {
		accessKeyId: env.BACKBLAZE_APPLICATION_KEY_ID,
		secretAccessKey: env.BACKBLAZE_APPLICATION_KEY,
	},
});

export const deleteFile = async (key: string) => {
	const command = new DeleteObjectCommand({
		Bucket: env.BACKBLAZE_BUCKET_NAME,
		Key: key,
	});

	await s3.send(command);
};

export const getSignedURL = async (type: string, size: number) => {
	if (!type || !size) throw new Error("Missing file information");
	if (!type.startsWith("image/")) throw new Error("Invalid file type");
	if (!env.NEXT_PUBLIC_CONFIG_IMAGE_FORMATS.includes(type)) {
		throw new Error(
			`Invalid file format. Must be one of: ${env.NEXT_PUBLIC_CONFIG_IMAGE_FORMATS.map(
				(format: string) => format.split("/")[1],
			).join(", ")})}`,
		);
	}

	if (size > env.NEXT_PUBLIC_CONFIG_IMAGE_MAX_SIZE) {
		throw new Error(`File is too big (${Math.round((size / 1024 / 1024) * 100) / 100} MB max)`);
	}

	const [session, task] = await Promise.all([isAuthorized(), getCurrentTask()]);

	if (!session?.user) throw new Error("Unauthorized");

	const command = new PutObjectCommand({
		Bucket: env.BACKBLAZE_BUCKET_NAME,
		Key: `submissions/${task?.id}/${session?.user?.id}`,
		ContentType: type,
		ContentLength: size,
	});

	return getSignedUrl(s3, command, {
		expiresIn: 60 * 5, // 5 minutes
	});
};

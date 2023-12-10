import {
	DeleteObjectCommand,
	PutObjectCommand,
	S3Client,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { imageConfig } from "@config";
import env from "@env";
import sharp from "sharp";
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

export const uploadFile = async (buffer: Buffer, type: string, key: string) => {
	const command = new PutObjectCommand({
		Bucket: env.BACKBLAZE_BUCKET_NAME,
		Key: key,
		Body: buffer,
		ContentType: type,
	});

	await s3.send(command);

	return `https://${env.BACKBLAZE_CDN_URL}/file/${env.BACKBLAZE_BUCKET_NAME}/${key}`;
};

export const deleteFile = async (key: string) => {
	const command = new DeleteObjectCommand({
		Bucket: env.BACKBLAZE_BUCKET_NAME,
		Key: key,
	});

	await s3.send(command);
};

export const compressImage = async (file: File, quality?: number) => {
	const sharpImage = sharp(Buffer.from(await file.arrayBuffer()));

	const metadata = await sharpImage.metadata();
	if (!metadata) throw new Error("Failed to get metadata");

	const size = metadata.size;
	if (!size) throw new Error("Failed to get image size");

	if (metadata.width && metadata.height) {
		const image = await sharpImage
			.toFormat(imageConfig.compression.format, {
				quality: quality ?? imageConfig.compression.quality,
			})
			.toBuffer();

		const compressionRate =
			Math.round(((size - image.length) / size) * 10000) / 100;

		console.log(`Compression rate: ${compressionRate}%`);

		return {
			buffer: image,
			type: "image/avif",
			size: image.length,
		};
	} else
		return {
			buffer: await sharpImage.toBuffer(),
			type: file.type,
			size: file.size,
		};
};

export const getSignedURL = async (type: string, size: number) => {
	if (!type.startsWith("image/")) throw new Error("Invalid file type");
	if (size > imageConfig.maxSize)
		throw new Error(
			`File is too big (${
				Math.round((size / 1024 / 1024) * 100) / 100
			} MB max)`,
		);
	const [session, task] = await Promise.all([isAuthorized(), getCurrentTask()]);

	const command = new PutObjectCommand({
		Bucket: env.BACKBLAZE_BUCKET_NAME,
		Key: `submissions/${task?.id}/${session?.user?.id}`,
		ContentType: type,
		ContentLength: size,
	});

	return getSignedUrl(s3, command, {
		expiresIn: 60 * 5,
	});
};

import { MetadataRoute } from "next";
import prisma from "@lib/prisma";
import env from "@env";
import { TaskStatus } from "@prisma/client";

const staticPaths = ["/", "/explore", "/submit", "/winners"];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
	const [submissionSlugs, usernames, taskSlugs] = await Promise.all([
		prisma.submission.findMany({
			select: {
				slug: true,
			},
			where: {
				task: {
					status: {
						in: [TaskStatus.VOTING, TaskStatus.CLOSED],
					},
				},
			},
		}),
		prisma.user.findMany({
			select: {
				username: true,
			},
		}),
		prisma.task.findMany({
			select: {
				slug: true,
			},
			where: {
				status: {
					in: [TaskStatus.VOTING, TaskStatus.CLOSED],
				},
			},
		}),
	]);

	const paths = [
		...staticPaths,
		...submissionSlugs.map(({ slug }) => `/submission/${slug}`),
		...usernames.map(({ username }) => `/user/${username}`),
		...taskSlugs.map(({ slug }) => `/task/${slug}`),
	];

	return paths.map((path) => ({
		url: `${env.NEXTAUTH_URL}${path}`,
		lastModified: new Date().toISOString(),
	}));
}

import prisma from "@lib/prisma.ts";
import { cache } from "react";

export const getSubmissionCached = cache(async (slug: string) => {
	return prisma.submission.findUnique({
		where: {
			slug,
		},
		include: {
			user: true,
			task: true,
		},
	});
});

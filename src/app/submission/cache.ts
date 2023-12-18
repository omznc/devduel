import prisma from "@lib/prisma.ts";
import { cache } from "react";
import { User } from '@prisma/client';

export const getSubmissionCached = cache(async (slug: string, requestedBy?: User["id"]) => {
	return prisma.submission.findUnique({
		where: {
			slug,
		},
		include: {
			user: {
				select: {
					username: true,
					image: true,
					name: true,
				},
			},
			votes: {
				where: {
					user: {
						id: requestedBy,
					}
				}
			},
			task: true,
		},
	});
});

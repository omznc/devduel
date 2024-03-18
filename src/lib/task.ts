import prisma from "@lib/prisma.ts";
import { TaskStatus } from "@prisma/client";
import { cache } from "react";

export const getCurrentTask = cache(async (includeSubmissions?: number) => {
	return prisma.task.findFirst({
		where: {
			status: {
				in: [TaskStatus.OPEN, TaskStatus.VOTING],
			},
		},
		include: {
			submissions: {
				take: includeSubmissions ?? 0,
				orderBy: {
					createdAt: "desc",
				},
				include: {
					user: {
						select: {
							name: true,
							image: true,
							id: true,
						},
					},
				},
			},
		},
	});
});

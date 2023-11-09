import prisma from '@lib/prisma.ts';
import { TaskStatus } from '@prisma/client';

export const getCurrentTask = async (includeSubmissions?: number) => {
	const today = new Date();
	const task = await prisma.task.findFirst({
		where: {
			startDate: {
				lte: today,
			},
			endDate: {
				gte: today,
			},
		},
		include: {
			submissions: {
				take: includeSubmissions ?? 0,
				orderBy: {
					createdAt: 'desc',
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
	if (!task) return null;

	task.status =
		today.getDay() === 0 || today.getDay() === 6
			? TaskStatus.VOTING
			: TaskStatus.OPEN;

	return task;
};

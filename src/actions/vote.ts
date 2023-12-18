"use server";

import { Submission, User } from "@prisma/client";
import { isAuthorized } from "@lib/server-utils.ts";
import prisma from "@lib/prisma.ts";

export const vote = async (id: Submission["id"]) => {
	const authorized = await isAuthorized();
	if (!authorized) throw new Error("Unauthorized");

	const submission = await prisma.submission.findUnique({
		where: {
			id,
		},
	});

	const user = authorized.user as User | null;
	if (!user) throw new Error("Unauthorized");

	if (submission.userId === user.id)
		throw new Error("You cannot vote for your own submission");

	try {
		await prisma.vote.create({
			data: {
				user: {
					connect: {
						id: user.id,
					},
				},
				submission: {
					connect: {
						id: submission.id,
					},
				},
			},
		});
	} catch (e) {
		throw new Error("You have already voted for this submission");
	}
};

export const unvote = async (id: Submission["id"]) => {
	const authorized = await isAuthorized();
	if (!authorized) throw new Error("Unauthorized");

	const submission = await prisma.submission.findUnique({
		where: {
			id,
		},
	});

	if (!submission) throw new Error("Submission not found");

	const user = authorized.user as User | null;
	if (!user) throw new Error("Unauthorized");

	await prisma.vote.deleteMany({
		where: {
			submissionId: submission.id,
			userId: user.id,
		},
	});
};

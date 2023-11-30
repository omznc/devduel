import prisma from "@lib/prisma.ts";
import { cache } from "react";

export const getTaskCached = cache(async (taskId: string) => {
  return prisma.task.findUnique({
    where: {
      id: taskId,
    },
  });
});

export const getSubmissionCached = cache(
  async (taskId: string, submissionId: string) => {
    return await prisma.submission.findUnique({
      where: {
        id: submissionId,
        taskId: taskId,
      },
      include: {
        user: true,
        task: true,
      },
    });
  },
);

import prisma from "@lib/prisma.ts";
import { cache } from "react";

export const getSubmissionCached = cache(async (submissionId: string) => {
  return prisma.submission.findUnique({
    where: {
      id: submissionId,
    },
    include: {
      user: true,
      task: true,
    },
  });
});

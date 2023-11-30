import env from "@env";
import prisma from "@lib/prisma.ts";
import { TaskStatus } from "@prisma/client";

export async function POST(request: Request) {
  const token = request.headers.get("Authorization")?.split(" ")[1];
  if (!token) return new Response("Unauthorized", { status: 401 });
  if (token !== env.ADMIN_API_TOKEN)
    return new Response("Unauthorized", { status: 401 });

  return prisma
    .$transaction(async (tx) => {
      const last = await tx.task.updateMany({
        where: {
          status: TaskStatus.VOTING,
        },
        data: {
          status: TaskStatus.CLOSED,
        },
      });

      if (last.count === 0)
        throw new Error("The current task is not in VOTING.");

      const nextTask = await tx.task.findFirst({
        where: {
          status: TaskStatus.HIDDEN,
        },
        orderBy: {
          createdAt: "asc",
        },
      });
      if (!nextTask) throw new Error("No tasks to start");

      await tx.task.update({
        where: {
          id: nextTask.id,
        },
        data: {
          status: TaskStatus.OPEN,
        },
      });

      return nextTask;
    })
    .then((task) => {
      return Response.json(task);
    })
    .catch((e) => {
      return new Response(e.message, { status: 400 });
    });
}

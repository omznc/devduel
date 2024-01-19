import env from "@env";
import prisma from "@lib/prisma.ts";
import { TaskStatus } from "@prisma/client";

export async function POST(request: Request) {
	const token = request.headers.get("Authorization")?.split(" ")[1];
	if (!token) return new Response("Unauthorized", { status: 401 });
	if (token !== env.ADMIN_API_TOKEN)
		return new Response("Unauthorized", { status: 401 });

	const task = await prisma.task.updateMany({
		where: {
			status: TaskStatus.OPEN,
		},
		data: {
			status: TaskStatus.VOTING,
		},
	});

	return Response.json({ task });
}

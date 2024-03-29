import AdminTaskForm from "@app/admin/admin-task-form.tsx";
import TaskList from "@app/admin/task-list.tsx";
import prisma from "@lib/prisma.ts";
import { isAuthorized } from "@lib/server-utils.ts";
import { redirect } from "next/navigation";

type PageProps = {
	searchParams: {
		edit?: string;
		skip?: string;
		take?: string;
	};
};

export default async function Page({ searchParams }: PageProps) {
	const session = await isAuthorized(true);
	if (!session) return redirect("/");

	const take = searchParams?.take ? parseInt(searchParams.take) : 10;
	const skip = searchParams?.skip ? parseInt(searchParams.skip) : 0;
	const [tasks, totalTasks] = await Promise.all([
		prisma.task.findMany({
			orderBy: {
				createdAt: "desc",
			},
			take,
			skip,
		}),
		prisma.task.count(),
	]);

	return (
		<div className="mt-16 flex h-full min-h-[calc(100dvh-6rem)] w-full flex-col items-center justify-start gap-8">
			<div className="flex h-full w-full flex-col items-center justify-start gap-4 font-bold transition-all">
				<span className="fit-text w-full text-center transition-all">{"Admin Page"}</span>
				<div className="flex w-full flex-wrap justify-center gap-4">
					<div className="flex w-full max-w-[500px] flex-col gap-2">
						<span className="w-full text-center text-xl transition-all">
							{searchParams.edit ? "Edit Task" : "Create Task"}
						</span>
						<AdminTaskForm />
					</div>
				</div>
			</div>
			<div className="flex w-full max-w-[1000px] flex-col gap-2">
				<span className="w-full text-center text-xl transition-all">{"Tasks"}</span>
				<TaskList tasks={tasks} take={take} skip={skip} total={totalTasks} />
			</div>
		</div>
	);
}

"use client";
import { Task } from "@prisma/client";
import { useRouter } from "next/navigation";

export default function TaskList({
	tasks,
	take,
	skip,
	total,
}: {
	tasks: Task[];
	take: number;
	skip: number;
	total: number;
}) {
	const router = useRouter();
	return (
		<>
			<table className="border-normal h-full w-full overflow-hidden p-4">
				<thead>
					<tr>
						<th className="w-1/3">{"Title"}</th>
						<th className="w-1/3">{"Description"}</th>
						<th className={"w-1/3"}>{"Created At"}</th>
					</tr>
				</thead>
				<tbody>
					{tasks.map((task) => (
						<tr key={task.id} className="border-normal">
							<td className="border-normal p-2">{task.title}</td>
							<td className="border-normal p-2">{task.description}</td>
							<td className="border-normal p-2">
								{new Date(task.createdAt).toLocaleString()}
							</td>
						</tr>
					))}
				</tbody>
			</table>
			<div className="flex w-full justify-center gap-2">
				<button
					className="border-normal rounded-sm bg-white p-2 transition-all disabled:opacity-50 dark:bg-black dark:text-white"
					onClick={() => {
						if (skip <= 0) return;
						router.push(`?skip=${skip - take}&take=${take}`);
					}}
					disabled={skip <= 0}
					aria-disabled={skip <= 0}
				>
					{"Previous"}
				</button>
				<button
					className="border-normal rounded-sm bg-white p-2 transition-all disabled:opacity-50 dark:bg-black dark:text-white"
					onClick={() => {
						if (skip + take >= total) return;
						router.push(`?skip=${skip + take}&take=${take}`);
					}}
					disabled={skip + take >= total}
					aria-disabled={skip + take >= total}
				>
					{"Next"}
				</button>
			</div>
		</>
	);
}

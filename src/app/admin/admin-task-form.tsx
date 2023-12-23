"use client";

import { createTask, getTask, updateTask } from "@/src/actions/admin.ts";
import { SubmitFormButton } from "@components/buttons.tsx";
import { toast } from "react-hot-toast";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Task } from "@prisma/client";

export default function AdminTaskForm() {
	const params = useSearchParams();
	const router = useRouter();
	const edit = params.get("edit");
	const [task, setTask] = useState<Task | null>(null);
	useEffect(() => {
		if (!edit) return;
		getTask(edit).then(setTask);
	}, [edit]);

	return (
		<form
			key={task?.id ?? "new"}
			action={(formData) => {
				if (!edit) {
					toast.promise(createTask(formData), {
						loading: "Creating task...",
						success: "Created task!",
						error: (e) => e?.message ?? "Failed to create task.",
					});
				} else {
					toast.promise(updateTask(formData, edit), {
						loading: "Updating task...",
						success: "Updated task!",
						error: (e) => e?.message ?? "Failed to update task.",
					});
				}
			}}
			className="flex w-full flex-col gap-2"
		>
			<label htmlFor="title">{"Title"}</label>
			<input
				type="text"
				name="title"
				className="border-normal rounded-sm bg-white p-2 dark:bg-black dark:text-white"
				defaultValue={task?.title}
			/>
			<label htmlFor="description">{"Description"}</label>
			<input
				type="text"
				name="description"
				className="border-normal rounded-sm bg-white p-2 dark:bg-black dark:text-white"
				defaultValue={task?.description ?? ""}
			/>
			<div className="flex w-full justify-center gap-2">
				{edit && (
					<button
						onClick={() => {
							setTask(null);
							router.push(`?`);
						}}
						className="border-normal w-full rounded-sm bg-white p-2 transition-all disabled:opacity-50 dark:bg-black dark:text-white"
						type={"button"}
					>
						{"Cancel"}
					</button>
				)}
				<SubmitFormButton
					style={{
						width: "100%",
					}}
				>
					{edit ? "Update Task" : "Create Task"}
				</SubmitFormButton>
			</div>
		</form>
	);
}

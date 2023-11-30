import { getCurrentTask } from "@lib/task.ts";
import { Submission, Task } from "@prisma/client";
import { create } from "zustand";

type CurrentTaskStore = {
	task:
		| (Task & {
				submissions: Submission[];
		  })
		| null;
	fetch: () => void;
};
const useCurrentTaskStore = create<CurrentTaskStore>((set) => ({
	task: null,
	fetch: async () => {
		const task = await getCurrentTask(20);
		set({ task });
	},
}));

export default useCurrentTaskStore;

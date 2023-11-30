import { create } from 'zustand'
import { Submission, Task } from '@prisma/client';
import { getCurrentTask } from '@lib/task.ts';

type CurrentTaskStore = {
  task: Task & {
    submissions: Submission[];
  } | null;
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

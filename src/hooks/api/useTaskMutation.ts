import { useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/query-keys";
import { toggleTaskStatus } from "@/services/tasks";
import type { Task } from "@/types/task";

export function useTaskMutation() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (taskId: string) => {
            const tasks =
                queryClient.getQueryData<Task[]>(queryKeys.tasks.all()) ?? [];
            return toggleTaskStatus(taskId, tasks);
        },
        onMutate: async (taskId) => {
            const previousTasks = queryClient.getQueryData<Task[]>(
                queryKeys.tasks.all()
            );

            queryClient.setQueryData<Task[]>(
                queryKeys.tasks.all(),
                (old = []) =>
                    old.map((task) =>
                        task.id === taskId
                            ? { ...task, completed: !task.completed }
                            : task
                    )
            );

            return { previousTasks };
        },
        onError: (_, __, context) => {
            queryClient.setQueryData(
                queryKeys.tasks.all(),
                context?.previousTasks
            );
        }
    });
}

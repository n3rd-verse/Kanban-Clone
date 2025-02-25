import { useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/query-keys";
import { deleteTask } from "@/services/tasks";
import type { Task } from "@/types/task";

export function useDeleteTaskMutation() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: deleteTask,
        onMutate: async (taskId) => {
            const previousTasks = queryClient.getQueryData<Task[]>(
                queryKeys.tasks.all()
            );

            queryClient.setQueryData<Task[]>(
                queryKeys.tasks.all(),
                (old = []) => old.filter((task) => task.id !== taskId)
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

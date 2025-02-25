import { useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/query-keys";
import { deleteTask } from "@/services/tasks";
import type { Task } from "@/types/task";

export function useDeleteTaskMutation() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: deleteTask,
        onSuccess: (deletedTaskId) => {
            queryClient.setQueryData<Task[]>(
                queryKeys.tasks.all(),
                (old = []) => old.filter((task) => task.id !== deletedTaskId)
            );

                description: "The task has been successfully deleted."
        }
    });
}

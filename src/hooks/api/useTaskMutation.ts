import { useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/query-keys";
import { toggleTaskStatus } from "@/services/tasks";
import type { Task } from "@/types/task";

export function useTaskMutation() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: toggleTaskStatus,
        onSuccess: (updatedTask) => {
            queryClient.setQueryData<Task[]>(
                queryKeys.tasks.all(),
                (old = []) =>
                    old.map((task) =>
                        task.id === updatedTask.id ? updatedTask : task
                    )
            );
        }
    });
}

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { openTask } from "@/services/tasks";

/**
 * Hook to perform a mutation for opening a task via OM Native API.
 * @returns A React Query mutation object to trigger openTask and handle success or error callbacks.
 */
export function useOpenTaskMutation() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: openTask,
        onError: (error, taskId, context) => {
            console.error("openTask failed :", error);
        }
    });
}

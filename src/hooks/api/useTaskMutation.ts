import { useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/query-keys";
import { toggleTaskStatus } from "@/services/tasks";
import type { Task } from "@/types/task";
import { useToast } from "@/components/ui/use-toast";

export function useTaskMutation() {
    const queryClient = useQueryClient();
    const { toast } = useToast();

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

            toast({
                title: "Task updated",
                description: updatedTask.completed
                    ? "Task marked as completed"
                    : "Task marked as incomplete"
            });
        },
        onError: (error) => {
            toast({
                variant: "destructive",
                title: "Error",
                description: `Failed to update task status: ${error.message ?? "Unknown error"}`
            });
        }
    });
}

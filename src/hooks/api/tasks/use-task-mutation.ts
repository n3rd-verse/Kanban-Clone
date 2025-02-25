import { useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/query-keys";
import { toggleTaskStatus } from "@/services/tasks";
import type { Task, TasksResponse, TaskStatus } from "@/types/task";
import { useToast } from "@/components/ui/use-toast";

export function useTaskMutation() {
    const queryClient = useQueryClient();
    const { toast } = useToast();

    const statuses: TaskStatus[] = [
        "new",
        "in_progress",
        "urgent",
        "completed"
    ];

    return useMutation({
        mutationFn: toggleTaskStatus,
        onSuccess: (updatedTask) => {
            statuses.forEach((status) => {
                queryClient.setQueryData<{
                    pages: TasksResponse[];
                    pageParams: number[];
                }>(queryKeys.tasks.infinite({ status: [status] }), (old) => {
                    if (!old) return old;

                    return {
                        ...old,
                        pages: old.pages.map((page) => ({
                            ...page,
                            tasks: page.tasks.map((task) =>
                                task.id === updatedTask.id ? updatedTask : task
                            )
                        }))
                    };
                });
            });

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

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/query-keys";
import { deleteTask } from "@/services/tasks";
import type { TasksResponse, TaskStatus } from "@/types/task";
import { useToast } from "@/components/ui/use-toast";

export function useDeleteTaskMutation() {
    const queryClient = useQueryClient();
    const { toast } = useToast();

    const statuses: TaskStatus[] = [
        "new",
        "in_progress",
        "urgent",
        "completed"
    ];

    return useMutation({
        mutationFn: deleteTask,
        onSuccess: (deletedTaskId) => {
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
                            tasks: page.tasks.filter(
                                (task) => task.id !== deletedTaskId
                            ),
                            total: page.total - 1
                        }))
                    };
                });
            });

            toast({
                title: "Task deleted",
                description: "The task has been successfully deleted."
            });
        },
        onError: (error) => {
            toast({
                variant: "destructive",
                title: "Error",
                description: `Failed to delete task: ${error.message ?? "Unknown error"}`
            });
        }
    });
}

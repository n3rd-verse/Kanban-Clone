import { useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/query-keys";
import { deleteTask } from "@/services/tasks";
import type { Task } from "@/types/task";
import { useToast } from "@/components/ui/use-toast";

export function useDeleteTaskMutation() {
    const queryClient = useQueryClient();
    const { toast } = useToast();

    return useMutation({
        mutationFn: deleteTask,
        onSuccess: (deletedTaskId) => {
            queryClient.setQueryData<Task[]>(
                queryKeys.tasks.all(),
                (old = []) => old.filter((task) => task.id !== deletedTaskId)
            );
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

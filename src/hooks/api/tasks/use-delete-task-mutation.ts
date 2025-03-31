import { useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/query-keys";
import { deleteTask } from "@/services/tasks";
import { useToast } from "@/components/ui/use-toast";
import { useTranslation } from "react-i18next";
import { Task } from "@/types/task";

export function useDeleteTaskMutation() {
    const queryClient = useQueryClient();
    const { toast } = useToast();
    const { t } = useTranslation();

    return useMutation({
        mutationFn: deleteTask,
        onMutate: async (taskId: string) => {
            await queryClient.cancelQueries({ queryKey: queryKeys.tasks.root });

            // Store the previous states for all queries
            const previousStates = new Map();

            // Get all task-related queries and their data
            const queries = queryClient.getQueriesData({
                queryKey: queryKeys.tasks.root
            });
            queries.forEach(([queryKey, data]: any) => {
                previousStates.set(queryKey, data);
            });

            // Optimistically remove the task from all queries
            queryClient.setQueriesData(
                { queryKey: queryKeys.tasks.root },
                (old: any) => {
                    if (!old) return old;
                    return {
                        ...old,
                        pages: old.pages.map((page: any) => ({
                            ...page,
                            tasks: page.tasks.filter(
                                (task: Task) => task.id !== taskId
                            ),
                            total: Math.max(0, page.total - 1)
                        }))
                    };
                }
            );

            return { previousStates };
        },
        onError: (err, taskId, context) => {
            // Revert all queries to their previous states
            if (context?.previousStates) {
                context.previousStates.forEach((data, queryKey) => {
                    queryClient.setQueryData(queryKey, data);
                });
            }

            toast({
                variant: "destructive",
                title: t("toast.titles.error"),
                description:
                    err instanceof Error
                        ? err.message
                        : t("errors.failedToDeleteTask")
            });
        }
    });
}

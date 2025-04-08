import { useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/query-keys";
import { toggleTaskStatus } from "@/services/tasks";
import { useToast } from "@/components/ui/use-toast";
import { useTranslation } from "react-i18next";
import { Task } from "@/types/task";
import { TaskStatus } from "@/constants/task-status";

export function useToggleTaskStatusMutation() {
    const queryClient = useQueryClient();
    const { toast } = useToast();
    const { t } = useTranslation();

    return useMutation({
        mutationFn: toggleTaskStatus,
        onMutate: async (taskId: string) => {
            // Cancel any outgoing refetches
            await queryClient.cancelQueries({ queryKey: queryKeys.tasks.root });

            // Store the previous states for both status queries
            const previousStates = new Map();

            // Find the task and its current status
            let targetTask: Task | undefined;
            let currentStatus: TaskStatus | undefined;

            const queries = queryClient.getQueriesData({
                queryKey: queryKeys.tasks.root
            });
            queries.forEach(([queryKey, data]: any) => {
                previousStates.set(queryKey, data);
                data?.pages?.forEach((page: any) => {
                    const task = page.tasks.find((t: Task) => t.id === taskId);
                    if (task) {
                        targetTask = task;
                        currentStatus = task.status;
                    }
                });
            });

            if (!targetTask || !currentStatus) {
                return { previousStates };
            }

            // Calculate new status
            const newStatus =
                currentStatus === TaskStatus.COMPLETED
                    ? TaskStatus.NEW
                    : TaskStatus.COMPLETED;

            // Remove from current status column
            queryClient.setQueriesData(
                {
                    queryKey: queryKeys.tasks.infinite({
                        status: [currentStatus]
                    })
                },
                (old: any) => {
                    if (!old) return old;
                    return {
                        ...old,
                        pages: old.pages.map((page: any) => ({
                            ...page,
                            tasks: page.tasks.filter(
                                (t: Task) => t.id !== taskId
                            ),
                            total: Math.max(0, page.total - 1)
                        }))
                    };
                }
            );

            // Add to new status column
            queryClient.setQueriesData(
                { queryKey: queryKeys.tasks.infinite({ status: [newStatus] }) },
                (old: any) => {
                    if (!old)
                        return {
                            pages: [
                                {
                                    tasks: [
                                        { ...targetTask, status: newStatus }
                                    ],
                                    total: 1
                                }
                            ],
                            pageParams: [0]
                        };

                    return {
                        ...old,
                        pages: old.pages.map((page: any, index: number) =>
                            index === 0
                                ? {
                                      ...page,
                                      tasks: [
                                          { ...targetTask, status: newStatus },
                                          ...page.tasks
                                      ],
                                      total: page.total + 1
                                  }
                                : page
                        )
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
                title: t("tasks.toggleStatus.error"),
                variant: "destructive",
                description:
                    err instanceof Error
                        ? err.message
                        : t("errors.failedToDeleteTask")
            });
        }
    });
}

import {
    useOptimisticMutation,
    storePreviousStates
} from "../core/use-optimistic-mutation";
import { queryKeys } from "@/lib/query-keys";
import { toggleTaskStatus } from "@/services/tasks";
import { useTranslation } from "react-i18next";
import { Task } from "@/types/task";
import { TaskStatus } from "@/constants/task-status";

export function useToggleTaskStatusMutation() {
    const { t } = useTranslation();

    return useOptimisticMutation({
        mutationFn: toggleTaskStatus,
        queryKey: [...queryKeys.tasks.root] as string[],

        optimisticUpdate: (queryClient, taskId: string) => {
            // Store previous states
            const previousStates = storePreviousStates(queryClient, [
                ...queryKeys.tasks.root
            ]);

            // Find the task and its current status
            let targetTask: Task | undefined;
            let currentStatus: TaskStatus | undefined;

            const queries = queryClient.getQueriesData({
                queryKey: queryKeys.tasks.root
            });
            queries.forEach(([queryKey, data]: any) => {
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

        errorTitle: t("tasks.toggleStatus.error"),
        errorDescription: (error) =>
            error instanceof Error
                ? error.message
                : t("errors.failedToDeleteTask")
    });
}

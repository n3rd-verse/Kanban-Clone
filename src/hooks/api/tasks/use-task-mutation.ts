import { useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/query-keys";
import { toggleTaskStatus } from "@/services/tasks";
import type { Task, TasksResponse } from "@/types/task";
import { useToast } from "@/components/ui/use-toast";
import { useTranslation } from "react-i18next";
import { TASK_STATUSES, TaskStatus } from "@/constants/task-status";

function getToggleStatusInfo(
    taskId: string,
    queryClient: ReturnType<typeof useQueryClient>
) {
    let taskToUpdate: Task | undefined;
    let sourceStatus: TaskStatus | undefined;

    for (const status of TASK_STATUSES) {
        const queryKey = queryKeys.tasks.infinite({ status: [status] });
        const data = queryClient.getQueryData<{ pages: TasksResponse[] }>(
            queryKey
        );
        if (!data?.pages) continue;

        const allTasks = data.pages.flatMap((p: TasksResponse) => p.tasks);
        const task = allTasks.find((t: Task) => t.id === taskId);

        if (task) {
            taskToUpdate = task;
            sourceStatus = status;
            break;
        }
    }

    if (!taskToUpdate || !sourceStatus) return null;

    const targetStatus: TaskStatus =
        taskToUpdate.status === TaskStatus.COMPLETED
            ? TaskStatus.NEW
            : TaskStatus.COMPLETED;
    const updatedTask = { ...taskToUpdate, status: targetStatus };

    return { taskToUpdate, sourceStatus, targetStatus, updatedTask };
}

export function useTaskMutation() {
    const queryClient = useQueryClient();
    const { toast } = useToast();
    const { t } = useTranslation();

    return useMutation({
        mutationFn: toggleTaskStatus,
        onMutate: async (taskId) => {
            await queryClient.cancelQueries({ queryKey: queryKeys.tasks.root });

            const previousCache = new Map();
            TASK_STATUSES.forEach((status) => {
                const queryKey = queryKeys.tasks.infinite({ status: [status] });
                previousCache.set(status, queryClient.getQueryData(queryKey));
            });

            const info = getToggleStatusInfo(taskId, queryClient);
            if (!info) return { previousCache };

            const { sourceStatus, targetStatus, updatedTask } = info;

            queryClient.setQueryData(
                queryKeys.tasks.infinite({ status: [sourceStatus] }),
                (old: any) => ({
                    ...old,
                    pages: old.pages.map((page: any) => ({
                        ...page,
                        tasks: page.tasks.filter((t: Task) => t.id !== taskId),
                        total: Math.max(0, page.total - 1)
                    }))
                })
            );

            queryClient.setQueryData(
                queryKeys.tasks.infinite({ status: [targetStatus] }),
                (old: any) => {
                    if (!old || !old.pages || old.pages.length === 0) {
                        return {
                            pages: [
                                {
                                    tasks: [updatedTask],
                                    total: 1,
                                    nextPage: undefined
                                }
                            ],
                            pageParams: [0]
                        };
                    }

                    return {
                        ...old,
                        pages: [
                            {
                                ...old.pages[0],
                                tasks: [updatedTask, ...old.pages[0].tasks],
                                total: old.pages[0].total + 1
                            },
                            ...old.pages.slice(1)
                        ]
                    };
                }
            );

            return { previousCache, info };
        },

        onError: (_, __, context) => {
            if (context?.previousCache) {
                TASK_STATUSES.forEach((status) => {
                    queryClient.setQueryData(
                        queryKeys.tasks.infinite({ status: [status] }),
                        context.previousCache.get(status)
                    );
                });
            }

            toast({
                variant: "destructive",
                title: t("toast.titles.error"),
                description: t("errors.failedToUpdateTask")
            });
        },

        onSuccess: () => {
            toast({
                title: t("toast.titles.success"),
                description: t("toast.descriptions.taskCompleted")
            });

            queryClient.invalidateQueries({ queryKey: queryKeys.tasks.root });
        }
    });
}

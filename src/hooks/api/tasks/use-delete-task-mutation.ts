import { useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/query-keys";
import { deleteTask } from "@/services/tasks";
import type { TasksResponse } from "@/types/task";
import { useToast } from "@/components/ui/use-toast";
import { TASK_STATUSES } from "@/constants/task-status";
import { useTranslation } from "react-i18next";

export function useDeleteTaskMutation() {
    const queryClient = useQueryClient();
    const { toast } = useToast();
    const { t } = useTranslation();

    return useMutation({
        mutationFn: deleteTask,
        onSuccess: (deletedTaskId) => {
            TASK_STATUSES.forEach((status) => {
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
                title: t("toast.titles.success"),
                description: t("toast.descriptions.taskDeleted")
            });
        },
        onError: (error) => {
            toast({
                variant: "destructive",
                title: t("toast.titles.error"),
                description:
                    error instanceof Error
                        ? error.message
                        : t("errors.failedToDeleteTask")
            });
        }
    });
}

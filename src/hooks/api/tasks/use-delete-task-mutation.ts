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
        onMutate: async (taskId) => {
            // 진행 중인 쿼리 취소
            await queryClient.cancelQueries({
                queryKey: queryKeys.tasks.root
            });

            // 이전 상태를 저장
            const previousCache = new Map();
            TASK_STATUSES.forEach((status) => {
                const queryKey = queryKeys.tasks.infinite({ status: [status] });
                previousCache.set(status, queryClient.getQueryData(queryKey));
            });

            // optimistic update: 모든 상태에서 해당 태스크 제거
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
                                (task) => task.id !== taskId
                            ),
                            total:
                                page.total -
                                (page.tasks.some((task) => task.id === taskId)
                                    ? 1
                                    : 0)
                        }))
                    };
                });
            });

            return { previousCache };
        },
        onSuccess: (deletedTaskId) => {
            toast({
                title: t("toast.titles.success"),
                description: t("toast.descriptions.taskDeleted")
            });

            queryClient.invalidateQueries({
                queryKey: queryKeys.tasks.root,
                refetchType: "none"
            });
        },
        onError: (error, taskId, context) => {
            // 오류 발생 시 이전 상태로 복원
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
                description:
                    error instanceof Error
                        ? error.message
                        : t("errors.failedToDeleteTask")
            });
        }
    });
}

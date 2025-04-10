import {
    useOptimisticMutation,
    storePreviousStates
} from "../core/use-optimistic-mutation";
import { queryKeys } from "@/lib/query-keys";
import { deleteTask } from "@/services/tasks";
import { useTranslation } from "react-i18next";
import { Task } from "@/types/task";

export function useDeleteTaskMutation() {
    const { t } = useTranslation();

    return useOptimisticMutation({
        mutationFn: deleteTask,
        queryKey: [...queryKeys.tasks.root] as string[],

        optimisticUpdate: (queryClient, taskId: string) => {
            // Store previous states
            const previousStates = storePreviousStates(queryClient, [
                ...queryKeys.tasks.root
            ]);

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

        errorTitle: t("toast.titles.error"),
        errorDescription: (error) =>
            error instanceof Error
                ? error.message
                : t("errors.failedToDeleteTask"),
        fallbackErrorMessage: t("errors.failedToDeleteTask")
    });
}

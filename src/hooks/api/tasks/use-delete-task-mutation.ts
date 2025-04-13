import {
    useOptimisticMutation,
    storePreviousStates
} from "../core/use-optimistic-mutation";
import { queryKeys } from "@/lib/query-keys";
import { deleteTask } from "@/services/tasks";
import { useTranslation } from "react-i18next";
import { Task } from "@/types/task";
import { useQueryClient } from "@tanstack/react-query";

interface DeleteTaskParams {
    id: string;
    title: string;
}

// Keep track of the current task outside of the component
let currentTaskRef: DeleteTaskParams | null = null;

export function useDeleteTaskMutation() {
    const { t } = useTranslation();
    const queryClient = useQueryClient();

    return useOptimisticMutation<string, unknown, DeleteTaskParams>({
        mutationFn: ({ id }: DeleteTaskParams) => deleteTask(id),
        queryKey: [...queryKeys.tasks.root] as string[],

        optimisticUpdate: (queryClient, variables: DeleteTaskParams) => {
            // Store the current task for error handling
            currentTaskRef = variables;

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
                                (task: Task) => task.id !== variables.id
                            ),
                            total: Math.max(0, page.total - 1)
                        }))
                    };
                }
            );

            return { previousStates };
        },

        onSuccess: () => {
            // 작업 목록 데이터 무효화하여 다시 불러오기
            queryClient.invalidateQueries({ queryKey: [queryKeys.tasks] });
        },

        errorTitle: t("toast.titles.error"),
        errorDescription: (error, variables) => {
            return error instanceof Error
                ? `${error.message} - Task: "${variables.title}"`
                : `${t("errors.failedToDeleteTask")} - Task: "${variables.title}"`;
        },
        fallbackErrorMessage: t("errors.failedToDeleteTask")
    });
}

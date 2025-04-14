import {
    useOptimisticMutation,
    storePreviousStates
} from "../core/use-optimistic-mutation";
import { undoDelete } from "@/services/tasks";
import { queryKeys } from "@/lib/query-keys";
import { useTranslation } from "react-i18next";
import { useQueryClient } from "@tanstack/react-query";
import { Task } from "@/types/task";

interface UndoDeleteParams {
    id: string;
    title: string;
    task: Task;
}

export function useUndoDeleteMutation() {
    const { t } = useTranslation();
    const queryClient = useQueryClient();

    return useOptimisticMutation<void, unknown, UndoDeleteParams>({
        mutationFn: ({ id }: UndoDeleteParams) => undoDelete(id),
        queryKey: [...queryKeys.tasks.root] as string[],

        optimisticUpdate: (queryClient, variables: UndoDeleteParams) => {
            // Store previous states
            const previousStates = storePreviousStates(queryClient, [
                ...queryKeys.tasks.root
            ]);

            // Optimistically add the task back to the queries
            queryClient.setQueriesData(
                { queryKey: queryKeys.tasks.root },
                (old: any) => {
                    if (!old) return old;
                    return {
                        ...old,
                        pages: old.pages.map((page: any) => ({
                            ...page,
                            tasks: [variables.task, ...page.tasks],
                            total: page.total + 1
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
                : `${t("errors.failedToRestoreTask")} - Task: "${variables.title}"`;
        },
        fallbackErrorMessage: t("errors.failedToRestoreTask")
    });
}

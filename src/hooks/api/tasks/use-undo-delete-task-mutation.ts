import {
    UndoDeleteParams,
    AnyUndoDeleteParams
} from "../core/use-undo-delete-mutation";
import { undoDelete } from "@/services/tasks";
import { queryKeys } from "@/lib/query-keys";
import { useQueryClient } from "@tanstack/react-query";
import { Task } from "@/types/task";
import {
    useOptimisticMutation,
    storePreviousStates
} from "../core/use-optimistic-mutation";
import { useTranslation } from "react-i18next";

/**
 * Task 데이터 항목 추출 헬퍼 함수
 */
function extractTaskData(params: AnyUndoDeleteParams<Task>): Task {
    // // task 필드 확인 (기존 방식)
    // if ("task" in params && params.task) {
    //     return params.task as Task;
    // }
    // item 필드 확인 (새 방식)
    if ("item" in params && params.item) {
        return params.item as Task;
    }

    throw new Error("No task data found in undo parameters");
}

/**
 * Task 삭제를 되돌리기 위한 훅
 * @returns Optimistic update를 지원하는 undo mutation 객체
 */
export function useUndoDeleteTaskMutation() {
    const queryClient = useQueryClient();
    const { t } = useTranslation();

    return useOptimisticMutation<void, unknown, AnyUndoDeleteParams<Task>>({
        mutationFn: ({ id }: AnyUndoDeleteParams<Task>) => undoDelete(id),
        queryKey: [...queryKeys.tasks.root] as string[],

        optimisticUpdate: (queryClient, variables) => {
            try {
                // 파라미터에서 task 데이터 추출
                const task = extractTaskData(variables);

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
                                tasks: [task, ...page.tasks],
                                total: page.total + 1
                            }))
                        };
                    }
                );

                return { previousStates };
            } catch (error) {
                console.error("Error in optimistic update:", error);
                return { previousStates: new Map() };
            }
        },

        onSuccess: () => {
            // 작업 목록 데이터 무효화하여 다시 불러오기
            queryClient.invalidateQueries({ queryKey: [queryKeys.tasks] });
        },

        errorTitle: t("toast.titles.error"),
        errorDescription: (error, variables) => {
            return error instanceof Error
                ? `${error.message} - Task: "${variables.title}"`
                : `${t(`errors.failedToRestoreTask`)} - Task: "${variables.title}"`;
        },
        fallbackErrorMessage: t(`errors.failedToRestoreTask`)
    });
}

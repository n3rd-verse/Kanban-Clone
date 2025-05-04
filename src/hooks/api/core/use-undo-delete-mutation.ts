import {
    useOptimisticMutation,
    storePreviousStates
} from "./use-optimistic-mutation";
import { queryKeys } from "@/lib/query-keys";
import { useTranslation } from "react-i18next";
import { useQueryClient } from "@tanstack/react-query";

/**
 * 일반 데이터 항목 삭제 취소를 위한 파라미터 인터페이스
 */
export interface UndoDeleteParams<T> {
    id: string;
    title: string;
    item: T;
}

/**
 * 레거시 Schedule 삭제 취소를 위한 파라미터 인터페이스
 */
export interface ScheduleUndoDeleteParams<T> {
    id: string;
    title: string;
    schedule: T;
}

/**
 * Task와 Schedule 모두 지원하는 통합 타입
 */
export type AnyUndoDeleteParams<T> =
    | UndoDeleteParams<T>
    | ScheduleUndoDeleteParams<T>;

/**
 * Optimistic Update 함수 타입 - 다양한 파라미터 유형을 지원
 */
type OptimisticUpdateFunction<T> = (
    queryClient: any,
    variables: AnyUndoDeleteParams<T>
) => { previousStates: any };

/**
 * 제네릭 undo delete 훅 - task, schedule 등의 항목 삭제 복원을 위한 공통 로직
 * @param options 복원에 필요한 설정 객체
 * @returns React Query mutation 객체
 */
export function useUndoDeleteMutation<T>({
    undoFunction,
    queryKey,
    optimisticUpdateFn,
    successCallback,
    itemTypeName
}: {
    undoFunction: (id: string) => Promise<void>;
    queryKey: string[];
    optimisticUpdateFn: OptimisticUpdateFunction<T>;
    successCallback?: () => void;
    itemTypeName: string;
}) {
    const { t } = useTranslation();
    const queryClient = useQueryClient();

    return useOptimisticMutation<void, unknown, AnyUndoDeleteParams<T>>({
        mutationFn: ({ id }: AnyUndoDeleteParams<T>) => undoFunction(id),
        queryKey: [...queryKey] as string[],
        optimisticUpdate: optimisticUpdateFn,

        onSuccess: () => {
            if (successCallback) {
                successCallback();
            }
        },

        errorTitle: t("toast.titles.error"),
        errorDescription: (error, variables) => {
            return error instanceof Error
                ? `${error.message} - ${itemTypeName}: "${variables.title}"`
                : `${t(`errors.failedToRestore${itemTypeName}`)} - ${itemTypeName}: "${variables.title}"`;
        },
        fallbackErrorMessage: t(`errors.failedToRestore${itemTypeName}`)
    });
}

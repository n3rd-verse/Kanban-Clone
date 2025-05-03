import {
    UndoDeleteParams,
    ScheduleUndoDeleteParams,
    AnyUndoDeleteParams
} from "../core/use-undo-delete-mutation";
import { undoDeleteSchedule } from "@/services/schedules";
import { queryKeys } from "@/lib/query-keys";
import { useQueryClient } from "@tanstack/react-query";
import { Schedule, ScheduleDay } from "@/types/schedule";
import {
    useOptimisticMutation,
    storePreviousStates
} from "../core/use-optimistic-mutation";
import { useTranslation } from "react-i18next";

/**
 * Schedule 데이터 항목 추출 헬퍼 함수
 */
function extractScheduleData(params: AnyUndoDeleteParams<Schedule>): Schedule {
    // schedule 필드 확인 (기존 방식)
    if ("schedule" in params && params.schedule) {
        return params.schedule;
    }
    // item 필드 확인 (새 방식)
    if ("item" in params && params.item) {
        return params.item;
    }

    throw new Error("No schedule data found in undo parameters");
}

/**
 * Schedule 삭제를 되돌리기 위한 훅
 * @returns Optimistic update를 지원하는 undo mutation 객체
 */
export function useUndoDeleteScheduleMutation() {
    const queryClient = useQueryClient();
    const { t } = useTranslation();

    return useOptimisticMutation<void, unknown, AnyUndoDeleteParams<Schedule>>({
        mutationFn: ({ id }: AnyUndoDeleteParams<Schedule>) =>
            undoDeleteSchedule(id),
        queryKey: [...queryKeys.schedules.all()] as string[],

        optimisticUpdate: (queryClient, variables) => {
            try {
                // 파라미터에서 schedule 데이터 추출
                const schedule = extractScheduleData(variables);

                // Find the correct day based on the schedule's type
                const scheduleDate =
                    schedule.type === "past"
                        ? new Date().toISOString().split("T")[0] // For past schedules, use today's date
                        : new Date().toISOString().split("T")[0]; // For future schedules, use today's date

                // Create a snapshot of the current state before modification
                const previousStates = storePreviousStates(queryClient, [
                    queryKeys.schedules.all() as unknown as string
                ]);

                // Optimistically update the schedule data
                queryClient.setQueryData(
                    queryKeys.schedules.all(),
                    (old: ScheduleDay[] | undefined) => {
                        if (!old)
                            return [
                                {
                                    id: `date-${Date.now()}`,
                                    date: scheduleDate,
                                    type: schedule.type,
                                    schedules: [schedule]
                                }
                            ];

                        // Try to find the day this schedule belongs to
                        let targetDay = old.find(
                            (day) => day.type === schedule.type
                        );

                        if (targetDay) {
                            // Day exists, add the schedule
                            return old.map((day: ScheduleDay) =>
                                day.id === targetDay!.id
                                    ? {
                                          ...day,
                                          schedules: [
                                              ...day.schedules,
                                              schedule
                                          ]
                                      }
                                    : day
                            );
                        } else {
                            // Day doesn't exist, create a new one
                            return [
                                ...old,
                                {
                                    id: `date-${Date.now()}`,
                                    date: scheduleDate,
                                    type: schedule.type,
                                    schedules: [schedule]
                                }
                            ];
                        }
                    }
                );

                return { previousStates };
            } catch (error) {
                console.error("Error in optimistic update:", error);
                return { previousStates: new Map() };
            }
        },

        onSuccess: () => {
            // Schedule 목록 데이터 무효화하여 다시 불러오기
            queryClient.invalidateQueries({ queryKey: [queryKeys.schedules] });
        },

        errorTitle: t("toast.titles.error"),
        errorDescription: (error, variables) => {
            return error instanceof Error
                ? `${error.message} - Schedule: "${variables.title}"`
                : `${t(`errors.failedToRestoreSchedule`)} - Schedule: "${variables.title}"`;
        },
        fallbackErrorMessage: t(`errors.failedToRestoreSchedule`)
    });
}

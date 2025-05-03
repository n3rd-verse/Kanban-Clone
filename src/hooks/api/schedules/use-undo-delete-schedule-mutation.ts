import {
    useOptimisticMutation,
    storePreviousStates
} from "../core/use-optimistic-mutation";
import { undoDeleteSchedule } from "@/services/schedules";
import { queryKeys } from "@/lib/query-keys";
import { useTranslation } from "react-i18next";
import { useQueryClient } from "@tanstack/react-query";
import { Schedule, ScheduleDay } from "@/types/schedule";

interface UndoDeleteParams {
    id: string;
    title: string;
    schedule: Schedule;
}

/**
 * Provides an optimistic mutation hook for undoing schedule deletion.
 * @returns A React Query mutation object that can be used to perform the undo.
 */
export function useUndoDeleteScheduleMutation() {
    const { t } = useTranslation();
    const queryClient = useQueryClient();

    return useOptimisticMutation({
        mutationFn: async ({ id }: UndoDeleteParams) => {
            await undoDeleteSchedule(id);
        },
        queryKey: [...queryKeys.schedules.all()] as string[],

        optimisticUpdate: (queryClient, params: UndoDeleteParams) => {
            const { id, schedule } = params;

            // Find the correct day based on the schedule's date
            const scheduleDays = queryClient.getQueryData<ScheduleDay[]>(
                queryKeys.schedules.all()
            );

            const scheduleDate =
                schedule.type === "past"
                    ? new Date().toISOString().split("T")[0] // For past schedules, use today's date
                    : new Date().toISOString().split("T")[0]; // For future schedules, use today's date
            // Note: Ideally we would use the actual date from the schedule

            // Create a snapshot of the current state before modification
            const previousState = storePreviousStates(queryClient, [
                queryKeys.schedules.all() as unknown as string
            ]);

            // Optimistically update the schedule
            queryClient.setQueryData<ScheduleDay[]>(
                queryKeys.schedules.all(),
                (old) => {
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
                        return old.map((day) =>
                            day.id === targetDay!.id
                                ? {
                                      ...day,
                                      schedules: [...day.schedules, schedule]
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

            return previousState;
        },

        errorTitle: t("toast.titles.error"),
        errorDescription: (error) =>
            error instanceof Error
                ? error.message
                : t("errors.failedToUndoDeleteSchedule"),
        fallbackErrorMessage: t("errors.failedToUndoDeleteSchedule")
    });
}

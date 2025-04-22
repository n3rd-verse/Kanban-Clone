import { useOptimisticMutation } from "../core/use-optimistic-mutation";
import { queryKeys } from "@/lib/query-keys";
import { deleteSchedule } from "@/services/schedules";
import { useTranslation } from "react-i18next";
import { ScheduleDay } from "@/types/schedule";

/**
 * Provides an optimistic mutation to delete a schedule event.
 * Removes the schedule from cache immediately and rolls back on error.
 * @returns A React Query mutation object to perform deleteSchedule with optimistic updates and error handling.
 */
export function useDeleteScheduleMutation() {
    const { t } = useTranslation();

    return useOptimisticMutation({
        mutationFn: deleteSchedule,
        queryKey: [...queryKeys.schedules.all()] as string[],

        optimisticUpdate: (queryClient, scheduleId: string) => {
            // Snapshot the previous value
            const previousSchedules = queryClient.getQueryData<ScheduleDay[]>(
                queryKeys.schedules.all()
            );

            // Optimistically update schedules
            queryClient.setQueryData<ScheduleDay[]>(
                queryKeys.schedules.all(),
                (old) => {
                    if (!old) return old;
                    return old
                        .map((day) => ({
                            ...day,
                            schedules: day.schedules.filter(
                                (schedule) => schedule.id !== scheduleId
                            )
                        }))
                        .filter((day) => day.schedules.length > 0);
                }
            );

            return { previousSchedules };
        },

        errorTitle: t("toast.titles.error"),
        errorDescription: (error) =>
            error instanceof Error
                ? error.message
                : t("errors.failedToDeleteSchedule"),
        fallbackErrorMessage: t("errors.failedToDeleteSchedule")
    });
}

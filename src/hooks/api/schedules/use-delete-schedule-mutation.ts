import {
    useOptimisticMutation,
    storePreviousStates
} from "../core/use-optimistic-mutation";
import { queryKeys } from "@/lib/query-keys";
import { deleteSchedule } from "@/services/schedules";
import { useTranslation } from "react-i18next";
import { ScheduleDay } from "@/types/schedule";
import { useQueryClient } from "@tanstack/react-query";

/**
 * Provides an optimistic mutation to delete a schedule event.
 * Removes the schedule from cache immediately and rolls back on error.
 * @returns A React Query mutation object to perform deleteSchedule with optimistic updates and error handling.
 */
export function useDeleteScheduleMutation() {
    const { t } = useTranslation();
    const queryClient = useQueryClient();

    return useOptimisticMutation<void, unknown, string>({
        mutationFn: deleteSchedule,
        queryKey: [...queryKeys.schedules.all()] as string[],

        optimisticUpdate: (queryClient, scheduleId: string) => {
            // Store previous states of all schedule queries
            const previousStates = storePreviousStates(queryClient, [
                ...queryKeys.schedules.all()
            ]);

            // Get all related queries to update
            const queries = queryClient.getQueriesData({
                queryKey: ["schedules"]
            });

            // Update all related queries
            queries.forEach(([queryKey]) => {
                queryClient.setQueryData(
                    queryKey,
                    (old: ScheduleDay[] | undefined) => {
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
            });

            return { previousStates };
        },

        onSuccess: () => {
            // Success 시 모든 schedule 관련 쿼리 무효화
            queryClient.invalidateQueries({ queryKey: ["schedules"] });
        },

        errorTitle: t("toast.titles.error"),
        errorDescription: (error) =>
            error instanceof Error
                ? error.message
                : t("errors.failedToDeleteSchedule"),
        fallbackErrorMessage: t("errors.failedToDeleteSchedule")
    });
}

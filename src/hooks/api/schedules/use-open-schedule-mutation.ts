import { useMutation, useQueryClient } from "@tanstack/react-query";
import { openSchedule } from "@/services/schedules";

/**
 * Hook to perform a mutation for opening a schedule event.
 * @returns A React Query mutation object to trigger openSchedule and handle success or error callbacks.
 */
export function useOpenScheduleMutation() {
    return useMutation({
        mutationFn: openSchedule,
        onError: (error, scheduleId, context) => {
            console.error("openSchedule failed :", error);
        }
    });
}

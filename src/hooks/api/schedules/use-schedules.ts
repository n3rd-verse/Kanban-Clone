import { useSuspenseQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/query-keys";
import { fetchSchedules } from "@/services/schedules";

/**
 * Hook to fetch schedules grouped by day using React Query's suspense mode.
 * @returns A suspense-query result containing an array of ScheduleDay objects.
 */
export function useSchedules() {
    return useSuspenseQuery({
        queryKey: queryKeys.schedules.all(),
        queryFn: fetchSchedules,
        select: (data) => {
            // 시작 시간 기준으로 정렬
            return data.map((dayInfo) => ({
                ...dayInfo,
                schedules: dayInfo.schedules
            }));
        }
    });
}

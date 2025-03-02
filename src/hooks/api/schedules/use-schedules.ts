import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/query-keys";
import { fetchSchedules } from "@/services/schedules";

export function useSchedules() {
    return useQuery({
        queryKey: queryKeys.schedules.all(),
        queryFn: fetchSchedules,
        select: (data) => {
            // 시작 시간 기준으로 정렬
            return data.map((dayInfo) => ({
                ...dayInfo,
                schedules: dayInfo.schedules.sort((a, b) =>
                    a.startTime.localeCompare(b.startTime)
                )
            }));
        }
    });
}

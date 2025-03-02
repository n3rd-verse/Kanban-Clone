import { useMemo } from "react";
import { mockScheduleDays } from "@/mocks/mockData";

export function useScheduleGroups() {
    return useMemo(() => {
        return mockScheduleDays.map((dayInfo) => ({
            ...dayInfo,
            schedules: dayInfo.schedules.sort((a, b) =>
                a.startTime.localeCompare(b.startTime)
            )
        }));
    }, []);
}

import { useSchedules } from "@/hooks/api/schedules/use-schedules";

export function useScheduleGroups() {
    const { data: scheduleGroups = [] } = useSchedules();
    return scheduleGroups;
}

import { useSchedules } from "@/hooks/api/schedules/use-schedules";

/**
 * Retrieves grouped schedule day data via useSchedules hook.
 * @returns An array of ScheduleDay groups, defaulting to an empty array if no data is available.
 */
export function useScheduleGroups() {
    const { data: scheduleGroups = [] } = useSchedules();
    return scheduleGroups;
}

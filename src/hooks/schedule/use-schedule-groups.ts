import { useSchedules } from "@/hooks/api/schedules/use-schedules";
import type { ScheduleFilters } from "@/types/schedule";

/**
 * Retrieves grouped schedule day data via useSchedules hook.
 * @returns An array of ScheduleDay groups, defaulting to an empty array if no data is available.
 */
export function useScheduleGroups(filters?: ScheduleFilters) {
    const { data: scheduleGroups = [] } = useSchedules(filters);
    return scheduleGroups;
}

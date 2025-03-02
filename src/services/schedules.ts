import { mockScheduleDays } from "@/mocks/mockData";
import type { ScheduleDay } from "@/types/schedule";

export async function fetchSchedules(): Promise<ScheduleDay[]> {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return mockScheduleDays;
}

import type { ScheduleDay } from "@/types/schedule";

export async function fetchSchedules(): Promise<ScheduleDay[]> {
    const json = await new Promise<string>((resolve) => {
        window.OMNative.getSchedules((json) => {
            resolve(json);
        });
    })

    const schedules = JSON.parse(json);
    return schedules;
}

export async function openSchedule(scheduleId:string) : Promise<void> {
    return await window.OMNative.openSchedule(scheduleId);
}

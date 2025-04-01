/**
 * Mock data
 */
// import { mockScheduleDays } from "@/mocks/mockData";
// import type { ScheduleDay } from "@/types/schedule";

// export async function fetchSchedules(): Promise<ScheduleDay[]> {
//     return mockScheduleDays;
//     // const json = await new Promise<string>((resolve) => {
//     //     window.OMNative.getSchedules((json) => {
//     //         resolve(json);
//     //     });
//     // })

//     // const schedules = JSON.parse(json);
//     // return schedules;
// }

// export async function openSchedule(scheduleId: string): Promise<void> {
//     return await window.OMNative.openSchedule(scheduleId);
// }

/**
 * OM Native
 */
import { ERROR_MESSAGES } from "@/constants/messages";
import type { ScheduleDay } from "@/types/schedule";

export async function fetchSchedules(): Promise<ScheduleDay[]> {
    const json = await new Promise<string>((resolve) => {
        window.OMNative.getSchedules((json) => {
            resolve(json);
        });
    });

    const schedules = JSON.parse(json);
    return schedules;
}

export async function openSchedule(scheduleId:string) : Promise<void> {
    return await window.OMNative.openSchedule(scheduleId);
}

export async function deleteSchedule(eventId:string) : Promise<void> {
    const success = await new Promise<boolean>((resolve) => {
        window.OMNative.deleteSchedule(eventId, (success) => {
            resolve(success);
        });
    });

    if (!success) {
        throw new Error(ERROR_MESSAGES.FAILED_TO_DELETE_EVENT);
    }
}

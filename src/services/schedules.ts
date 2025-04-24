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

/**
 * Fetches schedule days from the OM Native API, grouped by date.
 * @returns A promise resolving to an array of ScheduleDay objects representing daily schedules.
 */
export async function fetchSchedules(): Promise<ScheduleDay[]> {
    const filtersJson = JSON.stringify({
        assignee: [],
        startDate: "",
        endDate: "",
        categories:  [],
        page: 0,
        limit: 20
    });

    const json = await new Promise<string>((resolve) => {
        window.OMNative.getSchedules(filtersJson ,(json) => {
            resolve(json);
        });
    });

    const schedules = JSON.parse(json);
    return schedules;
}

/**
 * Opens the specified schedule event in the OM Native application.
 * @param scheduleId - The ID of the schedule event to open.
 * @returns A promise that resolves when the schedule has been opened.
 */
export async function openSchedule(scheduleId: string): Promise<void> {
    return await window.OMNative.openSchedule(scheduleId);
}

/**
 * Deletes a schedule event via the OM Native API.
 * @param eventId - The ID of the schedule event to delete.
 * @returns A promise that resolves when the event is successfully deleted.
 * @throws Error if the deletion fails.
 */
export async function deleteSchedule(eventId: string): Promise<void> {
    const success = await new Promise<boolean>((resolve) => {
        window.OMNative.deleteSchedule(eventId, (success) => {
            resolve(success);
        });
    });

    if (!success) {
        throw new Error(ERROR_MESSAGES.FAILED_TO_DELETE_EVENT);
    }
}

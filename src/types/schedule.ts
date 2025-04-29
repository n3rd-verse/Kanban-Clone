import { Address } from "./contact";

export interface Schedule {
    id: string;
    title: string;
    startTime: string;
    endTime: string;
    attendees: Address[];
    type: "past" | "future";
    location?: string;
    ai?: {
        topic?: string;
        summary?: string;
        popupInfo?: object;
    };
}

export interface ScheduleDay {
    id: string;
    date: string;
    type: "past" | "future";
    schedules: Schedule[];
}

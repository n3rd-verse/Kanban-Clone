export interface Schedule {
    id: string;
    title: string;
    startTime: string;
    endTime: string;
    attendees: string[];
    type: "past" | "future";
    location?: string;
}

export interface ScheduleDay {
    id:string;
    date: string;
    type: "past" | "future";
    schedules: Schedule[];
}

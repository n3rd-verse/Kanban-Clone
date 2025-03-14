export interface Schedule {
    id: string;
    title: string;
    startTime: string;
    endTime: string;
    attendees: Array<string | { name: string; email?: string }>;
    type: "past" | "future";
    location?: string;
}

export interface ScheduleDay {
    id: string;
    date: string;
    type: "past" | "future";
    schedules: Schedule[];
}

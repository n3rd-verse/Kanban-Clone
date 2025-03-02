export interface Schedule {
    id: string;
    title: string;
    startTime: string;
    endTime: string;
    type: "daily" | "meeting";
    location?: string;
}

export interface ScheduleDay {
    id: string;
    date: Date;
    schedules: Schedule[];
}

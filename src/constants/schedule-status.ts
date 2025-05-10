export enum ScheduleStatus {
    NEW = "new",
    IN_PROGRESS = "in_progress",
    URGENT = "urgent",
    COMPLETED = "completed"
}

export const SCHEDULE_STATUSES = [
    ScheduleStatus.NEW,
    ScheduleStatus.IN_PROGRESS,
    ScheduleStatus.URGENT,
    ScheduleStatus.COMPLETED
] as const;

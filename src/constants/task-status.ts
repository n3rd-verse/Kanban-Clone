export enum TaskStatus {
    NEW = "new",
    IN_PROGRESS = "in_progress",
    URGENT = "urgent",
    COMPLETED = "completed"
}

export const TASK_STATUSES = [
    TaskStatus.NEW,
    TaskStatus.IN_PROGRESS,
    TaskStatus.URGENT,
    TaskStatus.COMPLETED
] as const;

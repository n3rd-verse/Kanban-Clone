export type TaskStatus = "new" | "in_progress" | "urgent" | "completed";

export interface Task {
    id: string;
    title: string;
    assignee: Array<string | { name: string; email?: string }>;
    date?: string;
    status: TaskStatus;
    allowEdit?: boolean;
    ai?: {
        topic?: string;
        summary?: string;
        popupInfo?: object;
    };
}

export interface TaskDTO extends Task {}

export interface TaskFilters {
    status?: TaskStatus[];
    assignee?: string[];
    dateRange?: {
        start?: Date;
        end?: Date;
    };
    search?: string;
    limit?: number;
    page?: number;
}

export interface TasksResponse {
    tasks: TaskDTO[];
    total: number;
    nextPage?: number;
}

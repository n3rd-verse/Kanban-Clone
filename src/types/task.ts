export type TaskStatus = "new" | "in_progress" | "urgent" | "completed";

export interface Task {
    id: string;
    title: string;
    assignee: string[];
    date: string;
    status: TaskStatus;
    completed?: boolean;
}

export interface TaskDTO {
    id: string;
    title: string;
    assignee: string | string[];
    date: string;
    status: TaskStatus;
    completed?: boolean;
}

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

// API response type for paginated data
export interface TasksResponse {
    tasks: TaskDTO[];
    total: number;
    nextPage?: number;
}

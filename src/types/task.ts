export type TaskStatus = "new" | "in_progress" | "urgent" | "completed";

export interface Task {
    id: string;
    title: string;
    assignee: string[];
    date?: string;
    status: TaskStatus;
    allowEdit?: boolean;
    aiTopic?: string; // AI extracted topic
    aiSummary?: string; // AI generated summary
}

export interface TaskDTO {
    id: string;
    title: string;
    assignee: string | string[];
    date?: string;
    status: TaskStatus;
    allowEdit?: boolean;
    aiTopic?: string; // AI extracted topic
    aiSummary?: string; // AI generated summary
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

export interface TasksResponse {
    tasks: TaskDTO[];
    total: number;
    nextPage?: number;
}

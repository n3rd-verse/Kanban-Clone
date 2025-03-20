import { Address } from "./contact";
import { TaskStatus } from "@/constants/task-status";

export interface Task {
    id: string;
    title: string;
    assignee: Address[];
    date?: string;
    status: TaskStatus;
    allowEdit?: boolean;
    ai?: {
        topic?: string;
        summary?: string;
        popupInfo?: object;
    };
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
    tasks: Task[];
    total: number;
    nextPage?: number;
}

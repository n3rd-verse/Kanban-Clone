import { Address } from "./contact";
import { TaskStatus } from "@/constants/task-status";
import { TaskCategory } from "@/components/KanbanBoard/tasks/TaskFilter";

export interface Task {
    id: string;
    title: string;
    assignee: Address[];
    date?: string;
    status: TaskStatus;
    allowEdit?: boolean;
    categories?: string;
    assignedMe: boolean;
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
    categories?: TaskCategory[];
    search?: string;
    limit?: number;
    page?: number;
}

export interface TasksResponse {
    tasks: Task[];
    total: number;
    nextPage?: number;
}

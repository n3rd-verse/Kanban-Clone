export type TaskStatus = "new" | "in_progress" | "urgent" | "completed";

export interface Task {
    id: string;
    title: string;
    assignee: string[];
    date: string;
    status: TaskStatus;
    completed?: boolean;
}

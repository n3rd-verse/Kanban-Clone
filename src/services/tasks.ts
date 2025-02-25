import { mockTasks } from "@/mocks/mockData";
import type { Task } from "@/types/task";

export async function fetchTasks(): Promise<Task[]> {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return mockTasks;
}

export async function toggleTaskStatus(
    taskId: string,
    tasks: Task[]
): Promise<Task> {
    const task = tasks.find((t) => t.id === taskId);
    if (!task) throw new Error("Task not found");

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500));
    return { ...task, completed: !task.completed };
}

export async function deleteTask(taskId: string): Promise<string> {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500));
    return taskId;
}

import { mockTasks } from "@/mocks/mockData";
import type { Task, TaskFilters, TasksResponse } from "@/types/task";

let tasks = [...mockTasks]; // Mutable copy for simulating database

export async function fetchTasks(
    filters?: TaskFilters
): Promise<TasksResponse> {
    await new Promise((resolve) => setTimeout(resolve, 500));

    let filteredTasks = [...tasks];

    // Apply filters
    if (filters?.status?.length) {
        filteredTasks = filteredTasks.filter((task) =>
            filters.status?.includes(task.status)
        );
    }

    // Apply pagination
    const page = filters?.page || 0;
    const limit = filters?.limit || 20;
    const start = page * limit;
    const end = start + limit;

    return {
        tasks: filteredTasks.slice(start, end),
        total: filteredTasks.length,
        nextPage: end < filteredTasks.length ? page + 1 : undefined
    };
}

export async function toggleTaskStatus(taskId: string): Promise<Task> {
    await new Promise((resolve) => setTimeout(resolve, 0));

    const taskIndex = tasks.findIndex((t) => t.id === taskId);
    if (taskIndex === -1) throw new Error("Task not found");

    tasks[taskIndex] = {
        ...tasks[taskIndex],
        completed: !tasks[taskIndex].completed
    };
    return tasks[taskIndex];
}

export async function deleteTask(taskId: string): Promise<string> {
    await new Promise((resolve) => setTimeout(resolve, 0));

    const taskIndex = tasks.findIndex((t) => t.id === taskId);
    if (taskIndex === -1) throw new Error("Task not found");

    tasks = tasks.filter((t) => t.id !== taskId);
    return taskId;
}

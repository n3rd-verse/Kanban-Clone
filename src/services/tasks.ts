import { mockTasks } from "@/mocks/mockData";
import type { Task } from "@/types/task";

let tasks = [...mockTasks]; // Mutable copy for simulating database

export async function fetchTasks(): Promise<Task[]> {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return tasks;
}

export async function toggleTaskStatus(taskId: string): Promise<Task> {
    await new Promise((resolve) => setTimeout(resolve, 500));

    const taskIndex = tasks.findIndex((t) => t.id === taskId);
    if (taskIndex === -1) throw new Error("Task not found");

    tasks[taskIndex] = {
        ...tasks[taskIndex],
        completed: !tasks[taskIndex].completed
    };
    return tasks[taskIndex];
}

export async function deleteTask(taskId: string): Promise<string> {
    await new Promise((resolve) => setTimeout(resolve, 500));

    const taskIndex = tasks.findIndex((t) => t.id === taskId);
    if (taskIndex === -1) throw new Error("Task not found");

    tasks = tasks.filter((t) => t.id !== taskId);
    return taskId;
}

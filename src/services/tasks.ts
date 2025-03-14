// /**
//  * Mock data
//  */
// import { mockTasks } from "@/mocks/mockData";
// import type { Task, TaskFilters, TasksResponse } from "@/types/task";

// let tasks = [...mockTasks];

// export async function openTask(taskId: string): Promise<void> {
//     return await window.OMNative.openTask(taskId);
// }

// export async function fetchTasks(
//     filters?: TaskFilters
// ): Promise<TasksResponse> {
//     // const json = await new Promise<string>((resolve) => {
//     //     window.OMNative.getTasks((json) => {
//     //         resolve(json);
//     //     });
//     // });

//     // tasks = JSON.parse(json);

//     let filteredTasks = [...tasks];

//     // Apply filters
//     if (filters?.status?.length) {
//         filteredTasks = filteredTasks.filter((task) =>
//             filters.status?.includes(task.status)
//         );
//     }

//     // Apply pagination
//     const page = filters?.page || 0;
//     const limit = filters?.limit || 20;
//     const start = page * limit;
//     const end = start + limit;

//     return {
//         tasks: filteredTasks.slice(start, end),
//         total: filteredTasks.length,
//         nextPage: end < filteredTasks.length ? page + 1 : undefined
//     };
// }

// // export async function toggleTaskStatus(taskId: string): Promise<void> {
// export async function toggleTaskStatus(taskId: string): Promise<Task> {
//     const taskIndex = tasks.findIndex((t) => t.id === taskId);
//     if (taskIndex === -1) throw new Error("Task not found");

//     tasks[taskIndex] = {
//         ...tasks[taskIndex],
//         status: tasks[taskIndex].status === "completed" ? "new" : "completed"
//     };
//     return tasks[taskIndex];

//     // const success = await new Promise((resolve) => {
//     //     if (tasks[taskIndex].status == "completed") {
//     //         window.OMNative.clearTask(taskId, (success) => {
//     //             resolve(success);
//     //         });
//     //     } else {
//     //         window.OMNative.completeTask(taskId, (success) => {
//     //             resolve(success);
//     //         });
//     //     }
//     // });

//     // if (!success) throw new Error("Failed to completed task");
// }

// export async function deleteTask(taskId: string): Promise<string> {
//     // const success = await new Promise((resolve) => {
//     //     window.OMNative.deleteTask(taskId, (success) => {
//     //         resolve(success);
//     //     });
//     // });

//     const taskIndex = tasks.findIndex((t) => t.id === taskId);
//     if (taskIndex === -1) throw new Error("Task not found");
//     // if (!success) throw new Error("Failed to delete task");

//     tasks = tasks.filter((t) => t.id !== taskId);
//     return taskId;
// }

/**
 * OM Native
 */

import type { Task, TaskFilters, TasksResponse } from "@/types/task";

let tasks: Task[];

export async function openTask(taskId: string): Promise<void> {
    return await window.OMNative.openTask(taskId);
}

export async function fetchTasks(
    filters?: TaskFilters
): Promise<TasksResponse> {
    const json = await new Promise<string>((resolve) => {
        window.OMNative.getTasks((json) => {
            resolve(json);
        });
    });

    tasks = JSON.parse(json);

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

export async function toggleTaskStatus(taskId: string): Promise<void> {
    const taskIndex = tasks.findIndex((t) => t.id === taskId);
    if (taskIndex === -1) throw new Error("Task not found");

    const success = await new Promise((resolve) => {
        if (tasks[taskIndex].status == "completed") {
            window.OMNative.clearTask(taskId, (success) => {
                resolve(success);
            });
        } else {
            window.OMNative.completeTask(taskId, (success) => {
                resolve(success);
            });
        }
    });

    if (!success) throw new Error("Failed to completed task");
}

export async function deleteTask(taskId: string): Promise<string> {
    const success = await new Promise((resolve) => {
        window.OMNative.deleteTask(taskId, (success) => {
            resolve(success);
        });
    });

    const taskIndex = tasks.findIndex((t) => t.id === taskId);
    if (taskIndex === -1) throw new Error("Task not found");
    if (!success) throw new Error("Failed to delete task");

    tasks = tasks.filter((t) => t.id !== taskId);
    return taskId;
}

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
import { ERROR_MESSAGES } from "@/constants/messages";
import { TaskStatus } from "@/constants/task-status";

let tasks: Task[];

export async function openTask(taskId: string): Promise<void> {
    return await window.OMNative.openTask(taskId);
}

export async function fetchTasks(
    filters?: TaskFilters
): Promise<TasksResponse> {
    const filtersJson = JSON.stringify({
        status: filters?.status || [],
        assignee: filters?.assignee || [],
        startDate: filters?.dateRange?.start?.toISOString(),
        endDate: filters?.dateRange?.end?.toISOString(),
        categories: filters?.categories || [],
        assignedMe: null, // TODO 필터에 옵션이 들어갈 경우, 지정 가능.
        page: filters?.page || 0,
        limit: filters?.limit || 20
    });

    const json = await new Promise<string>((resolve) => {
        window.OMNative.getTasks(filtersJson, (json) => {
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

    return {
        tasks: filteredTasks,
        total: filteredTasks.length,
        nextPage: undefined
    };
}

export async function toggleTaskStatus(taskId: string): Promise<Task> {
    // // 에러 테스트용
    // await new Promise((_, reject) =>
    //     setTimeout(() => reject(new Error("test")), 1000)
    // );

    const taskIndex = tasks.findIndex((t) => t.id === taskId);
    if (taskIndex === -1) throw new Error(ERROR_MESSAGES.TASK_NOT_FOUND);

    const success = await new Promise<boolean>((resolve) => {
        if (tasks[taskIndex].status == TaskStatus.COMPLETED) {
            window.OMNative.clearTask(taskId, (success) => {
                resolve(success);
            });
        } else {
            window.OMNative.completeTask(taskId, (success) => {
                resolve(success);
            });
        }
    });

    if (!success) throw new Error(ERROR_MESSAGES.FAILED_TO_UPDATE_TASK);

    // 업데이트된 상태로 task 객체 업데이트
    const newStatus =
        tasks[taskIndex].status === TaskStatus.COMPLETED
            ? TaskStatus.NEW
            : TaskStatus.COMPLETED;
    const updatedTask: Task = {
        ...tasks[taskIndex],
        status: newStatus
    };

    // tasks 배열에 반영
    tasks[taskIndex] = updatedTask;

    return updatedTask;
}

export async function deleteTask(taskId: string): Promise<string> {
    // // 에러 테스트용
    // await new Promise((_, reject) =>
    //     setTimeout(() => reject(new Error("test")), 1000)
    // );

    const success = await new Promise((resolve) => {
        window.OMNative.deleteTask(taskId, (success) => {
            resolve(success);
        });
    });

    const taskIndex = tasks.findIndex((t) => t.id === taskId);
    if (taskIndex === -1) throw new Error(ERROR_MESSAGES.TASK_NOT_FOUND);
    if (!success) throw new Error(ERROR_MESSAGES.FAILED_TO_DELETE_TASK);

    tasks = tasks.filter((t) => t.id !== taskId);
    return taskId;
}

export async function undoDelete(taskId: string): Promise<void> {
    try {
        window.OMNative.undoDelete(taskId);

        // Moved the refreshTask call into undoDelete since it's executed asynchronously.
        // if (window.refreshTasks) {
        //     window.refreshTasks();
        // }

        return;
    } catch (error) {
        console.error("Failed to undo delete:", error);
        throw new Error("Failed to undo delete");
    }
}

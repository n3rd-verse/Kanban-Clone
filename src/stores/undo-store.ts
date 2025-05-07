import { create } from "zustand";
import type { Task } from "@/types/task";
import type { Schedule } from "@/types/schedule";

export interface DeletedTask {
    id: string;
    title: string;
    task: Task;
    timestamp: number;
    toastId?: string;
    dismissToast?: () => void;
}

export interface DeletedSchedule {
    id: string;
    title: string;
    schedule: Schedule;
    timestamp: number;
    toastId?: string;
    dismissToast?: () => void;
}

interface UndoState {
    deletedTasks: DeletedTask[];
    deletedSchedules: DeletedSchedule[];
    lastUndoneTask: DeletedTask | null;
    lastUndoneSchedule: DeletedSchedule | null;
    addDeletedTask: (taskData: Omit<DeletedTask, "timestamp">) => void;
    addDeletedSchedule: (
        scheduleData: Omit<DeletedSchedule, "timestamp">
    ) => void;
    getLastDeletedTask: () => DeletedTask | undefined;
    getLastDeletedSchedule: () => DeletedSchedule | undefined;
    getLastDeletedItem: () =>
        | { type: "task" | "schedule"; item: DeletedTask | DeletedSchedule }
        | undefined;
    removeDeletedTask: (id: string) => DeletedTask | undefined;
    removeDeletedSchedule: (id: string) => DeletedSchedule | undefined;
    clearDeletedTasks: () => void;
    clearDeletedSchedules: () => void;
    setLastUndoneTask: (task: DeletedTask | null) => void;
    setLastUndoneSchedule: (schedule: DeletedSchedule | null) => void;
    hasUndoableActions: () => boolean;
}

const MAX_HISTORY_SIZE = 150;

export const useUndoStore = create<UndoState>((set, get) => ({
    deletedTasks: [],
    deletedSchedules: [],
    lastUndoneTask: null,
    lastUndoneSchedule: null,

    addDeletedTask: (taskData) =>
        set((state) => ({
            deletedTasks: [
                { ...taskData, timestamp: Date.now() },
                ...state.deletedTasks
            ].slice(0, MAX_HISTORY_SIZE)
        })),

    addDeletedSchedule: (scheduleData) =>
        set((state) => ({
            deletedSchedules: [
                { ...scheduleData, timestamp: Date.now() },
                ...state.deletedSchedules
            ].slice(0, MAX_HISTORY_SIZE)
        })),

    getLastDeletedTask: () => {
        const { deletedTasks } = get();
        return deletedTasks.length > 0 ? deletedTasks[0] : undefined;
    },

    getLastDeletedSchedule: () => {
        const { deletedSchedules } = get();
        return deletedSchedules.length > 0 ? deletedSchedules[0] : undefined;
    },

    getLastDeletedItem: () => {
        const { deletedTasks, deletedSchedules } = get();

        if (deletedTasks.length === 0 && deletedSchedules.length === 0) {
            return undefined;
        }

        if (deletedTasks.length === 0) {
            return { type: "schedule", item: deletedSchedules[0] };
        }

        if (deletedSchedules.length === 0) {
            return { type: "task", item: deletedTasks[0] };
        }

        // Return the most recently deleted item (task or schedule)
        return deletedTasks[0].timestamp > deletedSchedules[0].timestamp
            ? { type: "task", item: deletedTasks[0] }
            : { type: "schedule", item: deletedSchedules[0] };
    },

    removeDeletedTask: (id) => {
        const { deletedTasks } = get();
        const taskToRemove = deletedTasks.find((task) => task.id === id);

        if (taskToRemove) {
            set((state) => ({
                deletedTasks: state.deletedTasks.filter(
                    (task) => task.id !== id
                ),
                lastUndoneTask: taskToRemove
            }));
        }

        return taskToRemove;
    },

    removeDeletedSchedule: (id) => {
        const { deletedSchedules } = get();
        const scheduleToRemove = deletedSchedules.find(
            (schedule) => schedule.id === id
        );

        if (scheduleToRemove) {
            set((state) => ({
                deletedSchedules: state.deletedSchedules.filter(
                    (schedule) => schedule.id !== id
                ),
                lastUndoneSchedule: scheduleToRemove
            }));
        }

        return scheduleToRemove;
    },

    clearDeletedTasks: () => set({ deletedTasks: [] }),

    clearDeletedSchedules: () => set({ deletedSchedules: [] }),

    setLastUndoneTask: (task) => set({ lastUndoneTask: task }),

    setLastUndoneSchedule: (schedule) => set({ lastUndoneSchedule: schedule }),

    hasUndoableActions: () =>
        get().deletedTasks.length > 0 || get().deletedSchedules.length > 0
}));

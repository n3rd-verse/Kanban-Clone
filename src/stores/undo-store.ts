import { create } from "zustand";
import type { Task } from "@/types/task";

export interface DeletedTask {
    id: string;
    title: string;
    task: Task;
    timestamp: number;
    toastId?: string;
    dismissToast?: () => void;
}

interface UndoState {
    deletedTasks: DeletedTask[];
    lastUndoneTask: DeletedTask | null;
    addDeletedTask: (taskData: Omit<DeletedTask, "timestamp">) => void;
    getLastDeletedTask: () => DeletedTask | undefined;
    removeDeletedTask: (id: string) => DeletedTask | undefined;
    clearDeletedTasks: () => void;
    setLastUndoneTask: (task: DeletedTask | null) => void;
    hasUndoableActions: () => boolean;
}

const MAX_HISTORY_SIZE = 150;

export const useUndoStore = create<UndoState>((set, get) => ({
    deletedTasks: [],
    lastUndoneTask: null,

    addDeletedTask: (taskData) =>
        set((state) => ({
            deletedTasks: [
                { ...taskData, timestamp: Date.now() },
                ...state.deletedTasks
            ].slice(0, MAX_HISTORY_SIZE)
        })),

    getLastDeletedTask: () => {
        const { deletedTasks } = get();
        return deletedTasks.length > 0 ? deletedTasks[0] : undefined;
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

    clearDeletedTasks: () => set({ deletedTasks: [] }),

    setLastUndoneTask: (task) => set({ lastUndoneTask: task }),

    hasUndoableActions: () => get().deletedTasks.length > 0
}));

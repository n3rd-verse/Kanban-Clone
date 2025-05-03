import { useCallback } from "react";
import {
    useUndoStore,
    DeletedTask,
    DeletedSchedule
} from "@/stores/undo-store";
import { useUndoDeleteTaskMutation } from "@/hooks/api/tasks/use-undo-delete-task-mutation";
import { useUndoDeleteScheduleMutation } from "@/hooks/api/schedules/use-undo-delete-schedule-mutation";
import {
    useKeyboardShortcuts,
    createUndoShortcut
} from "../api/core/use-keyboard-shortcuts";
import { TaskUndoDeleteParams } from "../api/core/use-undo-delete-mutation";

/**
 * Hook to handle undo functionality with keyboard shortcuts
 */
export const useUndoKeyboardShortcut = () => {
    const {
        getLastDeletedItem,
        removeDeletedTask,
        removeDeletedSchedule,
        hasUndoableActions
    } = useUndoStore();

    const { mutate: undoDeleteTask } = useUndoDeleteTaskMutation();
    const { mutate: undoDeleteSchedule } = useUndoDeleteScheduleMutation();

    const executeUndo = useCallback(() => {
        const lastDeletedItem = getLastDeletedItem();

        if (!lastDeletedItem) return false;

        if (lastDeletedItem.type === "task") {
            const task = lastDeletedItem.item as DeletedTask;
            // Execute undo operation for task
            undoDeleteTask({
                id: task.id,
                title: task.title,
                task: task.task
            });

            // Dismiss toast if exists
            task.dismissToast?.();

            // Clean up store
            removeDeletedTask(task.id);
        } else {
            // schedule
            const schedule = lastDeletedItem.item as DeletedSchedule;
            // Execute undo operation for schedule
            undoDeleteSchedule({
                id: schedule.id,
                title: schedule.title,
                item: schedule.schedule
            });

            // Dismiss toast if exists
            schedule.dismissToast?.();

            // Clean up store
            removeDeletedSchedule(schedule.id);
        }

        return true;
    }, [
        getLastDeletedItem,
        removeDeletedTask,
        removeDeletedSchedule,
        undoDeleteTask,
        undoDeleteSchedule
    ]);

    // Get the current undo state
    const canUndo = hasUndoableActions();

    // Register the keyboard shortcut using our new core hook
    useKeyboardShortcuts(
        [createUndoShortcut(executeUndo)],
        // Only enable if there are actions that can be undone
        // Pass the value instead of the function call to ensure reactivity
        canUndo
    );

    return { executeUndo, canUndo };
};

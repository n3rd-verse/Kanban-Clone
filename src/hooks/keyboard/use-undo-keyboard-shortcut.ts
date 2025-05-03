import { useCallback } from "react";
import {
    useUndoStore,
    DeletedTask,
    DeletedSchedule
} from "@/stores/undo-store";
import { useUndoDeleteMutation } from "@/hooks/api/tasks/use-undo-delete-mutation";
import { useUndoDeleteScheduleMutation } from "@/hooks/api/schedules/use-undo-delete-schedule-mutation";
import {
    useKeyboardShortcuts,
    createUndoShortcut
} from "../api/core/use-keyboard-shortcuts";

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

    const { mutate: undoDeleteTask } = useUndoDeleteMutation();
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
                schedule: schedule.schedule
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

    // Register the keyboard shortcut using our new core hook
    useKeyboardShortcuts(
        [createUndoShortcut(executeUndo)],
        // Only enable if there are actions that can be undone
        hasUndoableActions()
    );

    return { executeUndo, canUndo: hasUndoableActions };
};

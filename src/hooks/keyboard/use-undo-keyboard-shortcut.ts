import { useCallback } from "react";
import { useUndoStore } from "@/stores/undo-store";
import { useUndoDeleteMutation } from "@/hooks/api/tasks/use-undo-delete-mutation";
import {
    useKeyboardShortcuts,
    createUndoShortcut
} from "../api/core/use-keyboard-shortcuts";

/**
 * Hook to handle undo functionality with keyboard shortcuts
 */
export const useUndoKeyboardShortcut = () => {
    const { getLastDeletedTask, removeDeletedTask, hasUndoableActions } =
        useUndoStore();
    const { mutate: undoDelete } = useUndoDeleteMutation();

    const executeUndo = useCallback(() => {
        const lastDeletedTask = getLastDeletedTask();

        if (!lastDeletedTask) return false;

        // Execute undo operation
        undoDelete({
            id: lastDeletedTask.id,
            title: lastDeletedTask.title,
            task: lastDeletedTask.task
        });

        // Dismiss toast if exists
        lastDeletedTask.dismissToast?.();

        // Clean up store
        removeDeletedTask(lastDeletedTask.id);

        return true;
    }, [getLastDeletedTask, removeDeletedTask, undoDelete]);

    // Register the keyboard shortcut using our new core hook
    useKeyboardShortcuts(
        [createUndoShortcut(executeUndo)],
        // Only enable if there are actions that can be undone
        hasUndoableActions()
    );

    return { executeUndo, canUndo: hasUndoableActions };
};

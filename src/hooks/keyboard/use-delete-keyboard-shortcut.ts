import { useCallback } from "react";
import { useSelectionStore } from "@/stores/selection-store";
import { useDeleteTaskMutation } from "@/hooks/api/tasks/use-delete-task-mutation";
import { useUndoStore } from "@/stores/undo-store";
import { showDeleteToast } from "@/components/ui/undo-toast";
import { TOAST_CONFIG } from "@/constants/toast-config";
import { useUndoDeleteTaskMutation } from "@/hooks/api/tasks/use-undo-delete-task-mutation";
import { useKeyboardShortcuts } from "../api/core/use-keyboard-shortcuts";

type KeyCombo = {
    key: string;
    ctrlKey?: boolean;
    metaKey?: boolean;
    shiftKey?: boolean;
    altKey?: boolean;
};

type KeyboardShortcut = {
    combo: KeyCombo | KeyCombo[];
    action: (event: KeyboardEvent) => void;
    preventDefault?: boolean;
    description?: string;
};

/**
 * Hook to handle deleting the selected task with Backspace key
 */
export const useDeleteKeyboardShortcut = () => {
    const { selectedTaskId, clearSelection, tasksByStatus } =
        useSelectionStore();
    const { mutate: deleteTask } = useDeleteTaskMutation();
    const { mutate: undoDelete } = useUndoDeleteTaskMutation();
    const { addDeletedTask } = useUndoStore();

    // Find the selected task in tasksByStatus
    const findSelectedTask = useCallback(() => {
        if (!selectedTaskId) return null;

        for (const [status, tasks] of Object.entries(tasksByStatus)) {
            const task = tasks.find((task) => task.id === selectedTaskId);
            if (task) return task;
        }
        return null;
    }, [selectedTaskId, tasksByStatus]);

    const executeDelete = useCallback(() => {
        const selectedTask = findSelectedTask();
        if (!selectedTask) return false;

        deleteTask({ id: selectedTask.id, title: selectedTask.title });

        const { dismiss, id } = showDeleteToast({
            title: "1 deleted",
            actionLabel: "Undo",
            duration: TOAST_CONFIG.DURATIONS.DEFAULT,
            onAction: () => {
                undoDelete({
                    id: selectedTask.id,
                    title: selectedTask.title,
                    item: selectedTask
                });
                dismiss();
            }
        });

        // Add to undo store
        addDeletedTask({
            id: selectedTask.id,
            title: selectedTask.title,
            task: selectedTask,
            toastId: id,
            dismissToast: dismiss
        });

        // Clear selection after delete
        clearSelection();

        return true;
    }, [
        findSelectedTask,
        deleteTask,
        undoDelete,
        addDeletedTask,
        clearSelection
    ]);

    // Define the backspace shortcut
    const backspaceShortcut: KeyboardShortcut = {
        combo: { key: "Backspace" },
        action: () => executeDelete(),
        preventDefault: true,
        description: "Delete selected task"
    };

    // Register the keyboard shortcut
    useKeyboardShortcuts(
        [backspaceShortcut],
        // Only enable if there's a selected task
        !!selectedTaskId
    );

    return { executeDelete, canDelete: !!selectedTaskId };
};

import { useState, useCallback, useMemo } from "react";
import type { Task } from "@/types/task";
import { useDeleteTaskMutation } from "@/hooks/api/tasks/use-delete-task-mutation";
import { useToggleTaskStatusMutation } from "@/hooks/api/tasks/use-toggle-task-status-mutation";
import { useOpenTaskMutation } from "@/hooks/api/tasks/use-open-task-mutation";
import { useUndoDeleteMutation } from "@/hooks/api/tasks/use-undo-delete-mutation";
import { useUndoStore } from "@/stores/undo-store";
import { showDeleteToast } from "@/components/ui/undo-toast";
import { TOAST_CONFIG } from "@/constants/toast-config";
import { TaskStatus } from "@/constants/task-status";

/**
 * Custom hook managing the state and interactions for a TaskCard component.
 * Handles delete, complete, open, and undo actions, as well as AI summary visibility and hover state.
 * @param task - The Task object to manage and operate on.
 * @returns An object containing:
 *   - state: {
 *       showAiSummary: boolean;
 *       isLoading: boolean;
 *       contentInfo: object;
 *     } current UI state
 *   - handlers: {
 *       handleDelete: () => void;
 *       handleComplete: () => void;
 *       handleClick: (e: React.MouseEvent) => void;
 *       handleCardMouseEnter: () => void;
 *       handleCardMouseLeave: () => void;
 *       handlePopoverOpenChange: (open: boolean) => void;
 *     } callback functions for user interactions
 */
export function useTaskCard(task: Task) {
    const { mutate: deleteTask, isPending: isDeleting } =
        useDeleteTaskMutation();
    const { mutate: toggleTask, isPending: isToggling } =
        useToggleTaskStatusMutation();
    const { mutate: openTask } = useOpenTaskMutation();
    const { mutate: undoDelete } = useUndoDeleteMutation();
    const { addDeletedTask } = useUndoStore();
    const [showAiSummary, setShowAiSummary] = useState(false);

    const isLoading = isDeleting || isToggling;

    const handleDelete = useCallback(() => {
        deleteTask({ id: task.id, title: task.title });

        const { dismiss, id } = showDeleteToast({
            title: "1 deleted",
            actionLabel: "Undo",
            duration: TOAST_CONFIG.DURATIONS.DEFAULT,
            onAction: () => {
                undoDelete({ id: task.id, title: task.title, task });
                dismiss();
            }
        });

        addDeletedTask({
            id: task.id,
            title: task.title,
            task,
            toastId: id,
            dismissToast: dismiss
        });
    }, [deleteTask, task, undoDelete, addDeletedTask]);

    const handleComplete = useCallback(() => {
        toggleTask(task.id);
    }, [toggleTask, task.id]);

    const handleClick = useCallback(
        (e: React.MouseEvent) => {
            if (window.getSelection()?.toString()) {
                return;
            }
            openTask(task.id);
        },
        [openTask, task.id]
    );

    const handleCardMouseEnter = useCallback(() => {
        setShowAiSummary(true);
    }, []);

    const handleCardMouseLeave = useCallback(() => {
        setShowAiSummary(false);
    }, []);

    const handlePopoverOpenChange = useCallback((open: boolean) => {
        setShowAiSummary(open);
    }, []);

    const contentInfo = useMemo(() => {
        const hasAssignees = task.assignee && task.assignee.length > 0;
        const hasDate = task.date && task.status !== TaskStatus.COMPLETED;
        const hasMiddleRowContent = hasAssignees || hasDate;
        const isCompleted = task.status === TaskStatus.COMPLETED;

        return {
            hasAssignees,
            hasDate,
            hasMiddleRowContent,
            isCompleted
        };
    }, [task.assignee, task.date, task.status]);

    return {
        state: {
            showAiSummary,
            isLoading,
            contentInfo
        },
        handlers: {
            handleDelete,
            handleComplete,
            handleClick,
            handleCardMouseEnter,
            handleCardMouseLeave,
            handlePopoverOpenChange
        }
    };
}

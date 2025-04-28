import { renderHook, act } from "@testing-library/react";
import { useDeleteKeyboardShortcut } from "../use-delete-keyboard-shortcut";
import { useSelectionStore } from "@/stores/selection-store";
import { useDeleteTaskMutation } from "@/hooks/api/tasks/use-delete-task-mutation";
import { useUndoDeleteMutation } from "@/hooks/api/tasks/use-undo-delete-mutation";
import { useUndoStore } from "@/stores/undo-store";
import { showDeleteToast } from "@/components/ui/undo-toast";
import { TOAST_CONFIG } from "@/constants/toast-config";
import { TaskStatus } from "@/constants/task-status";
import { vi, describe, it, expect, beforeEach } from "vitest";

// Mock dependencies
vi.mock("@/stores/selection-store");
vi.mock("@/hooks/api/tasks/use-delete-task-mutation");
vi.mock("@/hooks/api/tasks/use-undo-delete-mutation");
vi.mock("@/stores/undo-store");
vi.mock("@/components/ui/undo-toast");
vi.mock("../api/core/use-keyboard-shortcuts", () => ({
    useKeyboardShortcuts: vi.fn()
}));

describe("useDeleteKeyboardShortcut", () => {
    const mockTask = {
        id: "task-1",
        title: "Test Task",
        status: TaskStatus.NEW
    };

    const mockTasksByStatus = {
        [TaskStatus.NEW]: [mockTask]
    };

    const mockDeleteTask = vi.fn();
    const mockUndoDelete = vi.fn();
    const mockAddDeletedTask = vi.fn();
    const mockClearSelection = vi.fn();

    // Mock toast functions
    const mockDismiss = vi.fn();
    const mockToastId = "toast-1";

    beforeEach(() => {
        vi.clearAllMocks();

        // Setup mocks
        (useSelectionStore as any).mockReturnValue({
            selectedTaskId: mockTask.id,
            tasksByStatus: mockTasksByStatus,
            clearSelection: mockClearSelection
        });

        (useDeleteTaskMutation as any).mockReturnValue({
            mutate: mockDeleteTask
        });

        (useUndoDeleteMutation as any).mockReturnValue({
            mutate: mockUndoDelete
        });

        (useUndoStore as any).mockReturnValue({
            addDeletedTask: mockAddDeletedTask
        });

        (showDeleteToast as any).mockReturnValue({
            dismiss: mockDismiss,
            id: mockToastId
        });
    });

    it("should return executeDelete function and canDelete flag", () => {
        const { result } = renderHook(() => useDeleteKeyboardShortcut());

        expect(result.current.executeDelete).toBeInstanceOf(Function);
        expect(result.current.canDelete).toBe(true);
    });

    it("should not execute delete when no task is selected", () => {
        (useSelectionStore as any).mockReturnValue({
            selectedTaskId: undefined,
            tasksByStatus: {},
            clearSelection: mockClearSelection
        });

        const { result } = renderHook(() => useDeleteKeyboardShortcut());

        act(() => {
            const deleted = result.current.executeDelete();
            expect(deleted).toBe(false);
        });

        expect(mockDeleteTask).not.toHaveBeenCalled();
        expect(showDeleteToast).not.toHaveBeenCalled();
        expect(mockAddDeletedTask).not.toHaveBeenCalled();
        expect(mockClearSelection).not.toHaveBeenCalled();
    });

    it("should properly execute delete when a task is selected", () => {
        const { result } = renderHook(() => useDeleteKeyboardShortcut());

        act(() => {
            const deleted = result.current.executeDelete();
            expect(deleted).toBe(true);
        });

        // Check that delete was called
        expect(mockDeleteTask).toHaveBeenCalledWith({
            id: mockTask.id,
            title: mockTask.title
        });

        // Check that toast was shown
        expect(showDeleteToast).toHaveBeenCalledWith({
            title: "1 deleted",
            actionLabel: "Undo",
            duration: TOAST_CONFIG.DURATIONS.DEFAULT,
            onAction: expect.any(Function)
        });

        // Check that task was added to undo store
        expect(mockAddDeletedTask).toHaveBeenCalledWith({
            id: mockTask.id,
            title: mockTask.title,
            task: mockTask,
            toastId: mockToastId,
            dismissToast: mockDismiss
        });

        // Check that selection was cleared
        expect(mockClearSelection).toHaveBeenCalled();
    });

    it("should trigger undo when toast action is called", () => {
        const { result } = renderHook(() => useDeleteKeyboardShortcut());

        act(() => {
            result.current.executeDelete();
        });

        // Get the onAction function that was passed to showDeleteToast
        const onAction = (showDeleteToast as any).mock.calls[0][0].onAction;

        // Call the onAction function to simulate clicking Undo
        act(() => {
            onAction();
        });

        // Check that undo was called with the right params
        expect(mockUndoDelete).toHaveBeenCalledWith({
            id: mockTask.id,
            title: mockTask.title,
            task: mockTask
        });

        // Check that toast was dismissed
        expect(mockDismiss).toHaveBeenCalled();
    });
});

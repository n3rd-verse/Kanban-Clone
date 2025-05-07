import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useTaskFilter } from "../use-task-filter";
import { useNavigate, useSearch } from "@tanstack/react-router";
import { TaskCategory } from "@/components/KanbanBoard/tasks";

vi.mock("@/routes", () => ({
    Route: {
        fullPath: "/"
    }
}));

vi.mock("@tanstack/react-router", () => ({
    useNavigate: vi.fn(),
    useSearch: vi.fn()
}));

vi.mock("@/components/KanbanBoard/TaskFilter", () => ({
    TaskCategory: {
        IMPORTANT: "important",
        COMPANY: "company",
        NEWS: "news",
        OTHER: "other"
    }
}));

describe("useTaskFilter", () => {
    const mockNavigate = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
        (useNavigate as any).mockReturnValue(mockNavigate);
        (useSearch as any).mockReturnValue({ categories: [] });
    });

    it("should return selected categories from search params", () => {
        (useSearch as any).mockReturnValue({
            categories: [TaskCategory.IMPORTANT, TaskCategory.COMPANY]
        });

        const { result } = renderHook(() => useTaskFilter());

        expect(result.current.selectedCategories).toEqual([
            TaskCategory.IMPORTANT,
            TaskCategory.COMPANY
        ]);
    });

    it("should toggle category on when not already selected", () => {
        (useSearch as any).mockReturnValue({
            categories: []
        });

        const { result } = renderHook(() => useTaskFilter());

        act(() => {
            result.current.toggleCategory(TaskCategory.IMPORTANT);
        });

        expect(mockNavigate).toHaveBeenCalledWith({
            to: "/",
            search: {
                categories: [TaskCategory.IMPORTANT]
            }
        });
    });

    it("should toggle category off when already selected", () => {
        (useSearch as any).mockReturnValue({
            categories: [TaskCategory.IMPORTANT, TaskCategory.COMPANY]
        });

        const { result } = renderHook(() => useTaskFilter());

        act(() => {
            result.current.toggleCategory(TaskCategory.IMPORTANT);
        });

        expect(mockNavigate).toHaveBeenCalledWith({
            to: "/",
            search: {
                categories: [TaskCategory.COMPANY]
            }
        });
    });

    it("should clear all categories when clearCategories is called", () => {
        (useSearch as any).mockReturnValue({
            categories: [
                TaskCategory.IMPORTANT,
                TaskCategory.COMPANY,
                TaskCategory.NEWS
            ]
        });

        const { result } = renderHook(() => useTaskFilter());
        act(() => {
            result.current.deleteAllTasksAndSchedules();
        });

        expect(mockNavigate).toHaveBeenCalledWith({
            to: "/",
            search: {
                categories: []
            }
        });
    });
});

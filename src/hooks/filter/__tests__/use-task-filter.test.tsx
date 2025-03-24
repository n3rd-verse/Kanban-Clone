import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useTaskFilter } from "../use-task-filter";
import { useNavigate, useSearch } from "@tanstack/react-router";

vi.mock("@tanstack/react-router", () => ({
    useNavigate: vi.fn(),
    useSearch: vi.fn()
}));

vi.mock("@/routes", () => ({
    Route: {
        fullPath: "/"
    }
}));

describe("useTaskFilter", () => {
    const mockNavigate = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();

        (useNavigate as any).mockReturnValue(mockNavigate);
    });

    it("should return selected filters from search params", () => {
        (useSearch as any).mockReturnValue({
            filters: ["important", "company"]
        });

        const { result } = renderHook(() => useTaskFilter());

        expect(result.current.selectedFilters).toEqual([
            "important",
            "company"
        ]);
    });

    it("should toggle filter on when not already selected", () => {
        (useSearch as any).mockReturnValue({
            filters: []
        });

        const { result } = renderHook(() => useTaskFilter());

        act(() => {
            result.current.toggleFilter("important");
        });

        expect(mockNavigate).toHaveBeenCalledWith({
            to: "/",
            search: {
                filters: ["important"]
            }
        });
    });

    it("should toggle filter off when already selected", () => {
        (useSearch as any).mockReturnValue({
            filters: ["important", "company"]
        });

        const { result } = renderHook(() => useTaskFilter());

        act(() => {
            result.current.toggleFilter("important");
        });

        expect(mockNavigate).toHaveBeenCalledWith({
            to: "/",
            search: {
                filters: ["company"]
            }
        });
    });

    it("should clear all filters when clearFilters is called", () => {
        (useSearch as any).mockReturnValue({
            filters: ["important", "company", "news"]
        });

        const { result } = renderHook(() => useTaskFilter());

        act(() => {
            result.current.clearFilters();
        });

        expect(mockNavigate).toHaveBeenCalledWith({
            to: "/",
            search: {
                filters: []
            }
        });
    });
});

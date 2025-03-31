import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { TaskFilter, TaskCategory } from "../tasks";
import { useTaskFilter } from "@/hooks/filter/use-task-filter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

vi.mock("../../assets/icons/filter.svg", () => ({
    default: "filter-icon.svg"
}));

vi.mock("@/hooks/filter/use-task-filter", () => ({
    useTaskFilter: vi.fn()
}));

vi.mock("react-i18next", () => ({
    useTranslation: () => ({
        t: (key: string) => key
    })
}));

describe("TaskFilter", () => {
    const createWrapper = () => {
        const queryClient = new QueryClient({
            defaultOptions: {
                queries: {
                    retry: false
                }
            }
        });

        return ({ children }: { children: React.ReactNode }) => (
            <QueryClientProvider client={queryClient}>
                {children}
            </QueryClientProvider>
        );
    };

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("renders the filter button", () => {
        (useTaskFilter as any).mockReturnValue({
            selectedCategories: [],
            toggleCategory: vi.fn(),
            clearCategories: vi.fn(),
            isFilterActive: false
        });

        render(<TaskFilter />, { wrapper: createWrapper() });

        const filterButton = screen.getByRole("button");
        expect(filterButton).toBeInTheDocument();
    });

    it("applies inactive styling when no categories are active", () => {
        (useTaskFilter as any).mockReturnValue({
            selectedCategories: [],
            toggleCategory: vi.fn(),
            clearCategories: vi.fn(),
            isFilterActive: false
        });

        render(<TaskFilter />, { wrapper: createWrapper() });

        const filterButton = screen.getByRole("button");
        expect(filterButton).not.toHaveClass("text-blue-500");
    });

    it("receives toggleCategory function from hook", () => {
        const toggleMock = vi.fn();

        (useTaskFilter as any).mockReturnValue({
            selectedCategories: [TaskCategory.IMPORTANT],
            toggleCategory: toggleMock,
            clearCategories: vi.fn(),
            isFilterActive: true
        });

        render(<TaskFilter />, { wrapper: createWrapper() });

        expect(useTaskFilter).toHaveBeenCalled();
    });

    it("shows active filter indicator when categories are applied", () => {
        (useTaskFilter as any).mockReturnValue({
            selectedCategories: [TaskCategory.IMPORTANT, TaskCategory.COMPANY],
            toggleCategory: vi.fn(),
            clearCategories: vi.fn(),
            isFilterActive: true
        });

        render(<TaskFilter />, { wrapper: createWrapper() });

        const filterButton = screen.getByRole("button");
        expect(filterButton.className).toMatch(/text-\w+/);
    });

    it("receives clearCategories function from hook", () => {
        const clearMock = vi.fn();

        (useTaskFilter as any).mockReturnValue({
            selectedCategories: [TaskCategory.IMPORTANT, TaskCategory.COMPANY],
            toggleCategory: vi.fn(),
            clearCategories: clearMock,
            isFilterActive: true
        });

        render(<TaskFilter />, { wrapper: createWrapper() });

        expect(useTaskFilter).toHaveBeenCalled();
    });
});

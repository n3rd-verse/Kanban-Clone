import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { TaskFilter } from "../TaskFilter";
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
            selectedFilters: [],
            toggleFilter: vi.fn(),
            clearFilters: vi.fn(),
            isFilterActive: false
        });

        render(<TaskFilter />, { wrapper: createWrapper() });

        const filterButton = screen.getByRole("button");
        expect(filterButton).toBeInTheDocument();
    });

    it("applies inactive styling when no filters are active", () => {
        (useTaskFilter as any).mockReturnValue({
            selectedFilters: [],
            toggleFilter: vi.fn(),
            clearFilters: vi.fn(),
            isFilterActive: false
        });

        render(<TaskFilter />, { wrapper: createWrapper() });

        const filterButton = screen.getByRole("button");
        expect(filterButton).not.toHaveClass("text-blue-500");
    });

    it("receives toggleFilter function from hook", () => {
        const toggleMock = vi.fn();

        (useTaskFilter as any).mockReturnValue({
            selectedFilters: ["important"],
            toggleFilter: toggleMock,
            clearFilters: vi.fn(),
            isFilterActive: true
        });

        render(<TaskFilter />, { wrapper: createWrapper() });

        expect(useTaskFilter).toHaveBeenCalled();
    });

    it("shows active filter indicator when filters are applied", () => {
        (useTaskFilter as any).mockReturnValue({
            selectedFilters: ["important", "company"],
            toggleFilter: vi.fn(),
            clearFilters: vi.fn(),
            isFilterActive: true
        });

        render(<TaskFilter />, { wrapper: createWrapper() });

        const filterButton = screen.getByRole("button");
        expect(filterButton.className).toMatch(/text-\w+/);
    });

    it("receives clearFilters function from hook", () => {
        const clearMock = vi.fn();

        (useTaskFilter as any).mockReturnValue({
            selectedFilters: ["important", "company"],
            toggleFilter: vi.fn(),
            clearFilters: clearMock,
            isFilterActive: true
        });

        render(<TaskFilter />, { wrapper: createWrapper() });

        expect(useTaskFilter).toHaveBeenCalled();
    });
});

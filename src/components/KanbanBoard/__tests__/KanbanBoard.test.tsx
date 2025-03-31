import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, act } from "@testing-library/react";
import { KanbanBoard } from "../board";
import { useResponsiveLayout } from "@/hooks/design/use-responsive-layout";
import { QueryErrorBoundary } from "@/components/ErrorBoundary";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { I18nextProvider } from "react-i18next";
import i18n from "@/test/setup";

vi.mock("@/hooks/design/use-responsive-layout", () => ({
    useResponsiveLayout: vi.fn()
}));

vi.mock("@/components/ErrorBoundary", () => ({
    QueryErrorBoundary: vi.fn(({ children }) => children)
}));

vi.mock("../board/BoardColumns", () => ({
    TaskColumns: vi.fn(() => (
        <div data-testid="task-columns">Task Columns Mock</div>
    ))
}));

vi.mock("../schedules/ScheduleColumn", () => ({
    ScheduleColumn: vi.fn(() => (
        <div data-testid="schedule-column">Schedule Column Mock</div>
    ))
}));

vi.mock("react", async () => {
    const actual = await vi.importActual("react");
    return {
        ...actual,
        Suspense: ({ children }: { children: React.ReactNode }) => children
    };
});

describe("KanbanBoard", () => {
    let queryClient: QueryClient;

    beforeEach(() => {
        vi.clearAllMocks();

        queryClient = new QueryClient({
            defaultOptions: {
                queries: {
                    retry: false
                }
            }
        });

        (useResponsiveLayout as any).mockReturnValue({
            width: 300,
            maxVisibleTasks: 10
        });
    });

    const createWrapper = () => {
        return ({ children }: { children: React.ReactNode }) => (
            <I18nextProvider i18n={i18n}>
                <QueryClientProvider client={queryClient}>
                    {children}
                </QueryClientProvider>
            </I18nextProvider>
        );
    };

    it("renders the TaskColumns component with correct props", async () => {
        await act(async () => {
            render(<KanbanBoard />, { wrapper: createWrapper() });
        });

        const taskColumns = screen.getByTestId("task-columns");
        expect(taskColumns).toBeInTheDocument();
        expect(taskColumns.textContent).toBe("Task Columns Mock");
    });

    it("renders the ScheduleColumn component", async () => {
        await act(async () => {
            render(<KanbanBoard />, { wrapper: createWrapper() });
        });

        const scheduleColumn = screen.getByTestId("schedule-column");
        expect(scheduleColumn).toBeInTheDocument();
        expect(scheduleColumn.textContent).toBe("Schedule Column Mock");
    });

    it("wraps the ScheduleColumn in error boundary", async () => {
        await act(async () => {
            render(<KanbanBoard />, { wrapper: createWrapper() });
        });

        expect(QueryErrorBoundary).toHaveBeenCalled();
    });

    it("applies the correct grid layout", async () => {
        await act(async () => {
            render(<KanbanBoard />, { wrapper: createWrapper() });
        });

        const gridContainer = screen
            .getByTestId("task-columns")
            .closest(".grid");

        expect(gridContainer).toHaveClass(
            "grid-cols-[minmax(0,1156fr)_minmax(0,377fr)]"
        );
    });
});

import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { KanbanBoard } from "../KanbanBoard";
import { useResponsiveLayout } from "@/hooks/design/use-responsive-layout";
import { QueryErrorBoundary } from "@/components/ErrorBoundary";
import { TaskColumns } from "../BoardColumns";
import { ScheduleColumn } from "../ScheduleColumn";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

vi.mock("@/hooks/design/use-responsive-layout", () => ({
    useResponsiveLayout: vi.fn()
}));

vi.mock("@/components/ErrorBoundary", () => ({
    QueryErrorBoundary: vi.fn(({ children }) => children)
}));

vi.mock("../BoardColumns", () => ({
    TaskColumns: vi.fn(() => (
        <div data-testid="task-columns">Task Columns Mock</div>
    ))
}));

vi.mock("../ScheduleColumn", () => ({
    ScheduleColumn: vi.fn(() => (
        <div data-testid="schedule-column">Schedule Column Mock</div>
    ))
}));

// Mock Suspense
vi.mock("react", async () => {
    const actual = await vi.importActual("react");
    return {
        ...actual,
        Suspense: ({ children }: { children: React.ReactNode }) => children
    };
});

describe("KanbanBoard", () => {
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

        (useResponsiveLayout as any).mockReturnValue({
            width: 300,
            maxVisibleTasks: 10
        });
    });

    it("renders the TaskColumns component with correct props", () => {
        render(<KanbanBoard />, { wrapper: createWrapper() });

        expect(screen.getByTestId("task-columns")).toBeInTheDocument();

        expect(TaskColumns).toHaveBeenCalled();

        const callProps = (TaskColumns as any).mock.calls[0][0];

        expect(callProps.maxVisibleTasks).toBe(10);
        expect(callProps.width).toBe(300);
    });

    it("renders the ScheduleColumn component", () => {
        render(<KanbanBoard />, { wrapper: createWrapper() });

        expect(screen.getByTestId("schedule-column")).toBeInTheDocument();
    });

    it("wraps the ScheduleColumn in error boundary", () => {
        render(<KanbanBoard />, { wrapper: createWrapper() });

        expect(QueryErrorBoundary).toHaveBeenCalled();
    });

    it("applies the correct grid layout", () => {
        render(<KanbanBoard />, { wrapper: createWrapper() });

        const gridContainer = screen
            .getByText("Task Columns Mock")
            .closest(".grid");

        expect(gridContainer).toHaveClass(
            "grid-cols-[minmax(0,1156fr)_minmax(0,377fr)]"
        );
    });
});

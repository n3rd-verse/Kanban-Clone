import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook } from "@testing-library/react";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { useInfiniteTasks } from "@/hooks/api/tasks/use-infinite-tasks";
import { useColumnVirtualizer } from "@/hooks/virtualizer/core/use-column-virtualizer";
import { COLUMN_SIZES } from "@/components/KanbanBoard/constants";
import { TaskStatus } from "@/constants/task-status";
import { useVirtualizedTasks } from "../use-virtualized-tasks";
import { createMemoryHistory } from "@tanstack/react-router";

vi.mock("@/hooks/api/tasks/use-infinite-tasks", () => ({
    useInfiniteTasks: vi.fn()
}));

vi.mock("@/hooks/virtualizer/core/use-column-virtualizer", () => ({
    useColumnVirtualizer: vi.fn()
}));

vi.mock("@/routes", () => ({
    Route: {
        fullPath: "/"
    }
}));

vi.mock("@tanstack/react-router", () => ({
    useNavigate: vi.fn(),
    useSearch: vi.fn().mockReturnValue({ categories: [] })
}));

describe("useVirtualizedTasks", () => {
    const columnRef = { current: document.createElement("div") };
    const loadMoreRef = { current: document.createElement("div") };

    const props = {
        status: TaskStatus.NEW,
        columnRef,
        loadMoreRef,
        maxVisibleTasks: 10,
        width: 300
    };

    const mockTasks = [
        { id: "1", title: "Task 1", status: TaskStatus.NEW },
        { id: "2", title: "Task 2", status: TaskStatus.NEW }
    ];

    let queryClient: QueryClient;
    let originalInnerHeight: number;

    const mockIntersectionObserver = vi.fn();
    const mockObserve = vi.fn();
    const mockDisconnect = vi.fn();

    mockIntersectionObserver.mockReturnValue({
        observe: mockObserve,
        disconnect: mockDisconnect
    });

    window.IntersectionObserver = mockIntersectionObserver;

    beforeEach(() => {
        vi.useFakeTimers();

        originalInnerHeight = window.innerHeight;
        Object.defineProperty(window, "innerHeight", {
            value: 1000,
            configurable: true
        });

        queryClient = new QueryClient({
            defaultOptions: {
                queries: {
                    retry: false,
                    staleTime: 0
                }
            }
        });

        vi.clearAllMocks();

        (useInfiniteTasks as any).mockReturnValue({
            data: {
                pages: [{ tasks: mockTasks }],
                pageParams: [0]
            },
            fetchNextPage: vi.fn(),
            hasNextPage: true,
            isFetchingNextPage: false,
            error: null
        });

        (useColumnVirtualizer as any).mockReturnValue({
            getVirtualItems: vi.fn().mockReturnValue([]),
            getTotalSize: vi.fn().mockReturnValue(200),
            scrollToIndex: vi.fn()
        });
    });

    afterEach(() => {
        vi.useRealTimers();
        vi.clearAllMocks();

        Object.defineProperty(window, "innerHeight", {
            value: originalInnerHeight,
            configurable: true
        });
    });

    const wrapper = ({ children }: { children: React.ReactNode }) => (
        <QueryClientProvider client={queryClient}>
            {children}
        </QueryClientProvider>
    );

    it("should initialize with correct styling for desktop", () => {
        const { result } = renderHook(
            () =>
                useVirtualizedTasks({
                    ...props,
                    width: COLUMN_SIZES.DESKTOP_BREAKPOINT + 100 // Desktop width
                }),
            { wrapper }
        );

        expect(result.current.columnStyle.height).toBe("auto");
        expect(result.current.scrollbarClass).toBe("overflow-visible");
    });

    it("should apply mobile styles when width is less than desktop breakpoint", () => {
        const { result } = renderHook(
            () =>
                useVirtualizedTasks({
                    ...props,
                    width: COLUMN_SIZES.DESKTOP_BREAKPOINT - 100 // Mobile width
                }),
            { wrapper }
        );

        expect(result.current.columnStyle.height).not.toBe("auto");
        expect(result.current.scrollbarClass).toBe("overflow-y-auto");
    });

    it("should create an IntersectionObserver", () => {
        renderHook(() => useVirtualizedTasks(props), { wrapper });

        expect(window.IntersectionObserver).toHaveBeenCalled();
    });

    it("fetches tasks for the correct status", () => {
        renderHook(() => useVirtualizedTasks(props), { wrapper });

        expect(useInfiniteTasks).toHaveBeenCalledWith({
            status: [props.status],
            categories: []
        });
    });

    it("initializes the virtualizer with correct params", () => {
        renderHook(() => useVirtualizedTasks(props), { wrapper });

        expect(useColumnVirtualizer).toHaveBeenCalledWith({
            tasks: mockTasks,
            columnRef: props.columnRef
        });
    });

    it("sets up intersection observer for infinite loading", () => {
        renderHook(() => useVirtualizedTasks(props), { wrapper });

        expect(mockIntersectionObserver).toHaveBeenCalled();
    });

    it("fetches next page when intersection occurs", () => {
        const mockFetchNextPage = vi.fn();

        (useInfiniteTasks as any).mockReturnValue({
            data: {
                pages: [{ tasks: mockTasks }],
                pageParams: [0]
            },
            fetchNextPage: mockFetchNextPage,
            hasNextPage: true,
            isFetchingNextPage: false,
            error: null
        });

        const { result } = renderHook(() => useVirtualizedTasks(props), {
            wrapper
        });

        const mockCallback = mockIntersectionObserver.mock.calls[0][0];

        mockCallback([{ isIntersecting: true }]);

        expect(mockFetchNextPage).toHaveBeenCalled();
    });

    it("combines all task pages into a single array", () => {
        const page1Tasks = [
            { id: "1", title: "Task 1", status: TaskStatus.NEW }
        ];
        const page2Tasks = [
            { id: "2", title: "Task 2", status: TaskStatus.NEW }
        ];

        (useInfiniteTasks as any).mockReturnValue({
            data: {
                pages: [{ tasks: page1Tasks }, { tasks: page2Tasks }],
                pageParams: [0, 1]
            },
            fetchNextPage: vi.fn(),
            hasNextPage: false,
            isFetchingNextPage: false,
            error: null
        });

        const { result } = renderHook(() => useVirtualizedTasks(props), {
            wrapper
        });

        expect(result.current.tasks).toHaveLength(2);
        expect(result.current.tasks[0].id).toBe("1");
        expect(result.current.tasks[1].id).toBe("2");
    });

    it("propagates error from tasks query", () => {
        const mockError = new Error("Failed to fetch tasks");

        (useInfiniteTasks as any).mockReturnValue({
            data: { pages: [], pageParams: [] },
            fetchNextPage: vi.fn(),
            hasNextPage: false,
            isFetchingNextPage: false,
            error: mockError
        });

        const { result } = renderHook(() => useVirtualizedTasks(props), {
            wrapper
        });

        expect(result.current.error).toBe(mockError);
    });
});

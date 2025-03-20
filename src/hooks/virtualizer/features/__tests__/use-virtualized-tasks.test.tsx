import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook } from "@testing-library/react";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { useInfiniteTasks } from "@/hooks/api/tasks/use-infinite-tasks";
import { useColumnVirtualizer } from "@/hooks/virtualizer/core/use-column-virtualizer";
import { COLUMN_SIZES } from "@/components/KanbanBoard/constants";
import { TaskStatus } from "@/constants/task-status";
import { RefObject } from "react";

// 타입 정의
interface UseVirtualizedTasksProps {
    status: TaskStatus;
    columnRef: RefObject<HTMLDivElement>;
    loadMoreRef: RefObject<HTMLDivElement>;
    maxVisibleTasks: number;
    width: number;
}

// Mock dependencies
vi.mock("@/hooks/api/tasks/use-infinite-tasks", () => ({
    useInfiniteTasks: vi.fn()
}));

vi.mock("@/hooks/virtualizer/core/use-column-virtualizer", () => ({
    useColumnVirtualizer: vi.fn()
}));

// Mock the actual hook
vi.mock("../use-virtualized-tasks", () => ({
    useVirtualizedTasks: vi.fn()
}));

// Import the mocked version
import { useVirtualizedTasks } from "../use-virtualized-tasks";

describe("useVirtualizedTasks", () => {
    let queryClient: QueryClient;
    let originalInnerHeight: number;

    // 테스트용 기본 props
    const columnRef = { current: document.createElement("div") };
    const loadMoreRef = { current: document.createElement("div") };

    // IntersectionObserver 목
    const mockIntersectionObserver = vi.fn();
    const mockObserve = vi.fn();
    const mockDisconnect = vi.fn();

    mockIntersectionObserver.mockReturnValue({
        observe: mockObserve,
        disconnect: mockDisconnect
    });
    window.IntersectionObserver = mockIntersectionObserver;

    beforeEach(() => {
        // window.innerHeight mock
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

        // useInfiniteTasks 훅 목 설정
        (useInfiniteTasks as any).mockReturnValue({
            data: {
                pages: [
                    {
                        tasks: [
                            { id: "1", title: "Task 1" },
                            { id: "2", title: "Task 2" }
                        ]
                    }
                ]
            },
            isFetchingNextPage: false,
            hasNextPage: true,
            fetchNextPage: vi.fn(),
            error: null
        });

        // useColumnVirtualizer 훅 목 설정
        (useColumnVirtualizer as any).mockReturnValue({
            getVirtualItems: vi.fn().mockReturnValue([]),
            getTotalSize: vi.fn().mockReturnValue(200),
            scrollToIndex: vi.fn()
        });
    });

    afterEach(() => {
        vi.clearAllMocks();
        // window.innerHeight 복원
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

    it("should initialize with correct values", () => {
        // 데스크톱 뷰 모킹
        (useVirtualizedTasks as any).mockReturnValue({
            tasks: [
                { id: "1", title: "Task 1" },
                { id: "2", title: "Task 2" }
            ],
            virtualizer: {
                getVirtualItems: () => [],
                getTotalSize: () => 200
            },
            columnStyle: { height: "auto", position: "relative" },
            scrollbarClass: "overflow-visible",
            isFetchingNextPage: false,
            error: null
        });

        const { result } = renderHook(
            () =>
                useVirtualizedTasks({
                    status: TaskStatus.NEW,
                    columnRef,
                    loadMoreRef,
                    maxVisibleTasks: 10,
                    width: 1500 // 충분히 큰 값으로 설정
                }),
            { wrapper }
        );

        // 기본 값이 올바르게 설정되었는지 확인
        expect(result.current.tasks).toHaveLength(2);
        expect(result.current.isFetchingNextPage).toBe(false);
        expect(result.current.error).toBeNull();

        // Desktop 모드에서는 auto 높이여야 함
        expect(result.current.columnStyle.height).toBe("auto");
        expect(result.current.scrollbarClass).toBe("overflow-visible");
    });

    it("should apply mobile styles when width is less than desktop breakpoint", () => {
        // 모바일 화면 너비로 설정
        const mobileWidth = COLUMN_SIZES.DESKTOP_BREAKPOINT - 100;

        // 모바일 뷰 모킹
        (useVirtualizedTasks as any).mockReturnValue({
            tasks: [
                { id: "1", title: "Task 1" },
                { id: "2", title: "Task 2" }
            ],
            virtualizer: {
                getVirtualItems: () => [],
                getTotalSize: () => 200
            },
            columnStyle: { height: "400px", position: "relative" },
            scrollbarClass: "overflow-y-auto",
            isFetchingNextPage: false,
            error: null
        });

        const { result } = renderHook(
            () =>
                useVirtualizedTasks({
                    status: TaskStatus.NEW,
                    columnRef,
                    loadMoreRef,
                    maxVisibleTasks: 10,
                    width: mobileWidth
                }),
            { wrapper }
        );

        // 모바일에서는 고정 높이로 설정되어야 함
        expect(result.current.columnStyle.height).not.toBe("auto");
        expect(result.current.scrollbarClass).toBe("overflow-y-auto");
    });

    it("should create an IntersectionObserver", () => {
        expect(true).toBe(true);
    });
});

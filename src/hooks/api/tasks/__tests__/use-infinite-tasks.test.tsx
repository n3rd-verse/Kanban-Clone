import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { useInfiniteTasks } from "../use-infinite-tasks";
import { fetchTasks } from "@/services/tasks";
import { TaskFilters } from "@/types/task";
import { TaskStatus } from "@/constants/task-status";

// Mock React Query
vi.mock("@tanstack/react-query", async () => {
    const actual = await vi.importActual("@tanstack/react-query");
    return {
        ...actual,
        useSuspenseInfiniteQuery: vi.fn()
    };
});

// Mock dependencies
vi.mock("@/services/tasks", () => ({
    fetchTasks: vi.fn()
}));

vi.mock("@/components/ui/use-toast", () => ({
    useToast: () => ({
        toast: vi.fn()
    })
}));

// Import the mocked version after mocking
import { useSuspenseInfiniteQuery } from "@tanstack/react-query";

describe("useInfiniteTasks", () => {
    let queryClient: QueryClient;

    // 각 테스트 전에 새로운 QueryClient 인스턴스 생성
    beforeEach(() => {
        queryClient = new QueryClient({
            defaultOptions: {
                queries: {
                    retry: false,
                    staleTime: 0
                }
            }
        });
    });

    // 각 테스트 후 목 함수 재설정
    afterEach(() => {
        vi.resetAllMocks();
    });

    const wrapper = ({ children }: { children: React.ReactNode }) => (
        <QueryClientProvider client={queryClient}>
            {children}
        </QueryClientProvider>
    );

    it("should fetch tasks with correct parameters", async () => {
        // Mock 응답 데이터 설정
        const mockTasksResponse = {
            tasks: [{ id: "1", title: "Test Task" }],
            total: 1,
            nextPage: undefined
        };

        (fetchTasks as any).mockResolvedValue(mockTasksResponse);

        // useSuspenseInfiniteQuery 모킹
        (useSuspenseInfiniteQuery as any).mockReturnValue({
            data: { pages: [mockTasksResponse], pageParams: [0] },
            isSuccess: true,
            fetchNextPage: vi.fn(),
            hasNextPage: false,
            isFetchingNextPage: false
        });

        // 필터 설정
        const filters: TaskFilters = { status: ["new" as TaskStatus] };

        // 훅 렌더링
        const { result } = renderHook(() => useInfiniteTasks(filters), {
            wrapper
        });

        // 비동기 작업 완료까지 대기
        await waitFor(() => {
            expect(result.current.isSuccess).toBe(true);
        });

        // useSuspenseInfiniteQuery가 올바른 매개변수로 호출되었는지 확인
        expect(useSuspenseInfiniteQuery).toHaveBeenCalledWith(
            expect.objectContaining({
                queryKey: expect.anything(),
                queryFn: expect.any(Function),
                initialPageParam: 0
            })
        );

        // 데이터가 올바르게 반환되었는지 확인
        expect(result.current.data?.pages[0]).toEqual(mockTasksResponse);
    });

    it("should handle error when fetching tasks fails", async () => {
        // 에러 설정
        const error = new Error("Network error");

        // useSuspenseInfiniteQuery 모킹 - 에러 상태
        (useSuspenseInfiniteQuery as any).mockReturnValue({
            isError: true,
            error: error,
            data: undefined
        });

        // 훅 렌더링
        const { result } = renderHook(() => useInfiniteTasks(), { wrapper });

        // 결과 확인
        expect(result.current.isError).toBe(true);
        expect(result.current.error).toBe(error);
    });

    it("should fetch next page when calling fetchNextPage", async () => {
        // 첫 번째 페이지 응답 설정
        const firstPageResponse = {
            tasks: [{ id: "1", title: "Task 1" }],
            total: 2,
            nextPage: 1
        };

        // 두 번째 페이지 응답 설정
        const secondPageResponse = {
            tasks: [{ id: "2", title: "Task 2" }],
            total: 2,
            nextPage: undefined
        };

        // fetchNextPage 목 함수
        const mockFetchNextPage = vi.fn();

        // useSuspenseInfiniteQuery 모킹 - 두 페이지 데이터로 설정
        (useSuspenseInfiniteQuery as any).mockReturnValue({
            data: {
                pages: [firstPageResponse, secondPageResponse],
                pageParams: [0, 1]
            },
            isSuccess: true,
            fetchNextPage: mockFetchNextPage,
            hasNextPage: false,
            isFetchingNextPage: false
        });

        // 훅 렌더링
        const { result } = renderHook(() => useInfiniteTasks(), { wrapper });

        // 결과 확인
        expect(result.current.data?.pages).toHaveLength(2);
        expect(result.current.data?.pages[0]).toEqual(firstPageResponse);
        expect(result.current.data?.pages[1]).toEqual(secondPageResponse);

        // 다음 페이지 로드
        result.current.fetchNextPage();

        // fetchNextPage가 호출되었는지 확인
        expect(mockFetchNextPage).toHaveBeenCalled();
    });
});

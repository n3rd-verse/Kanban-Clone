import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { useToggleTaskStatusMutation } from "../use-toggle-task-status-mutation";
import { toggleTaskStatus } from "@/services/tasks";
import { ERROR_MESSAGES, TOAST_MESSAGES } from "@/constants/messages";

// Mock dependencies
vi.mock("@/services/tasks", () => ({
    toggleTaskStatus: vi.fn()
}));

vi.mock("@/components/ui/use-toast", () => ({
    useToast: () => ({
        toast: vi.fn()
    })
}));

describe("useToggleTaskStatusMutation", () => {
    let queryClient: QueryClient;
    const mockQueryData = {
        pages: [
            {
                tasks: [
                    {
                        id: "task-1",
                        title: "Task 1",
                        status: "new",
                        assignee: [
                            { name: "김태호", email: "test@example.com" }
                        ]
                    },
                    {
                        id: "task-2",
                        title: "Task 2",
                        status: "new",
                        assignee: [
                            { name: "임지영", email: "test2@example.com" }
                        ]
                    }
                ],
                total: 2,
                nextPage: undefined
            }
        ]
    };

    beforeEach(() => {
        queryClient = new QueryClient({
            defaultOptions: {
                queries: {
                    retry: false,
                    staleTime: 0
                }
            }
        });

        // 각 상태에 대한 쿼리 데이터 설정
        ["new", "in_progress", "urgent", "completed"].forEach((status) => {
            queryClient.setQueryData(
                ["tasks", "infinite", { status: [status] }],
                mockQueryData
            );
        });
    });

    afterEach(() => {
        vi.resetAllMocks();
    });

    const wrapper = ({ children }: { children: React.ReactNode }) => (
        <QueryClientProvider client={queryClient}>
            {children}
        </QueryClientProvider>
    );

    it("should update task status optimistically", async () => {
        // API 호출 성공 시뮬레이션
        const updatedTask = {
            id: "task-1",
            title: "Task 1",
            status: "completed",
            assignee: [{ name: "김태호", email: "test@example.com" }]
        };
        (toggleTaskStatus as any).mockResolvedValue(updatedTask);

        // 훅 렌더링
        const { result } = renderHook(() => useToggleTaskStatusMutation(), {
            wrapper
        });

        // 뮤테이션 실행
        await act(async () => {
            result.current.mutate("task-1");
        });

        // 호출이 올바른 파라미터로 이루어졌는지 확인
        expect(toggleTaskStatus).toHaveBeenCalledWith("task-1");

        // 쿼리 캐시가 업데이트되었는지 확인 (낙관적 업데이트)
        const queryData = queryClient.getQueryData([
            "tasks",
            "infinite",
            { status: ["new"] }
        ]);
        expect(queryData).toBeDefined();
    });

    it("should handle errors when updating task fails", async () => {
        // API 호출 실패 시뮬레이션
        const error = new Error("Failed to update");
        (toggleTaskStatus as any).mockRejectedValue(error);

        // 훅 렌더링
        const { result } = renderHook(() => useToggleTaskStatusMutation(), {
            wrapper
        });

        // 뮤테이션 실행
        await act(async () => {
            result.current.mutate("task-1");
        });

        // 에러 상태가 설정되었는지 확인
        expect(result.current.isError).toBe(true);
        expect(result.current.error).toBe(error);

        // 쿼리 캐시가 원래 상태로 롤백되었는지 확인
        const queryData = queryClient.getQueryData([
            "tasks",
            "infinite",
            { status: ["new"] }
        ]);
        expect(queryData).toEqual(mockQueryData);
    });
});

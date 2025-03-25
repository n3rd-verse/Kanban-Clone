import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { useDeleteTaskMutation } from "../use-delete-task-mutation";
import { deleteTask } from "@/services/tasks";
import { TASK_STATUSES } from "@/constants/task-status";

vi.mock("@/services/tasks", () => ({
    deleteTask: vi.fn()
}));

vi.mock("@/components/ui/use-toast", () => ({
    useToast: () => ({
        toast: vi.fn()
    })
}));

vi.mock("react-i18next", () => ({
    useTranslation: () => ({
        t: (key: string) => key
    })
}));

describe("useDeleteTaskMutation", () => {
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
                            { name: "User 1", email: "user1@example.com" }
                        ]
                    },
                    {
                        id: "task-2",
                        title: "Task 2",
                        status: "new",
                        assignee: [
                            { name: "User 2", email: "user2@example.com" }
                        ]
                    }
                ],
                total: 2,
                nextPage: undefined
            }
        ],
        pageParams: [0]
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

        TASK_STATUSES.forEach((status) => {
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

    it("should optimistically delete task from cache", async () => {
        (deleteTask as any).mockResolvedValue("task-1");

        const { result } = renderHook(() => useDeleteTaskMutation(), {
            wrapper
        });

        await act(async () => {
            result.current.mutate("task-1");
        });

        expect(deleteTask).toHaveBeenCalledWith("task-1");

        TASK_STATUSES.forEach((status) => {
            const queryData = queryClient.getQueryData([
                "tasks",
                "infinite",
                { status: [status] }
            ]) as any;

            expect(queryData).toBeDefined();
            expect(queryData.pages[0].tasks.length).toBe(1);
            expect(
                queryData.pages[0].tasks.find((t: any) => t.id === "task-1")
            ).toBeUndefined();
            expect(queryData.pages[0].total).toBe(1);
        });
    });

    it("should handle errors and revert changes", async () => {
        const error = new Error("Failed to delete task");
        (deleteTask as any).mockRejectedValue(error);

        const { result } = renderHook(() => useDeleteTaskMutation(), {
            wrapper
        });

        await act(async () => {
            result.current.mutate("task-1");
        });

        expect(result.current.isError).toBe(true);
        expect(result.current.error).toBe(error);

        TASK_STATUSES.forEach((status) => {
            const queryData = queryClient.getQueryData([
                "tasks",
                "infinite",
                { status: [status] }
            ]) as any;

            expect(queryData).toBeDefined();
            expect(queryData).toEqual(mockQueryData);
        });
    });
});

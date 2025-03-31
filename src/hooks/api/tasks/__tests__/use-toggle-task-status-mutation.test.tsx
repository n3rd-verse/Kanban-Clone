import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { useToggleTaskStatusMutation } from "../use-toggle-task-status-mutation";
import { toggleTaskStatus } from "@/services/tasks";
import { ERROR_MESSAGES, TOAST_MESSAGES } from "@/constants/messages";
import { I18nextProvider } from "react-i18next";
import i18n from "@/test/setup";

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

    const createWrapper = () => {
        return ({ children }: { children: React.ReactNode }) => (
            <I18nextProvider i18n={i18n}>
                <QueryClientProvider client={queryClient}>
                    {children}
                </QueryClientProvider>
            </I18nextProvider>
        );
    };

    it("should update task status optimistically", async () => {
        const updatedTask = {
            id: "task-1",
            title: "Task 1",
            status: "completed",
            assignee: [{ name: "김태호", email: "test@example.com" }]
        };
        (toggleTaskStatus as any).mockResolvedValue(updatedTask);

        const { result } = renderHook(() => useToggleTaskStatusMutation(), {
            wrapper: createWrapper()
        });

        await act(async () => {
            result.current.mutate("task-1");
        });

        expect(toggleTaskStatus).toHaveBeenCalledWith("task-1");

        const queryData = queryClient.getQueryData([
            "tasks",
            "infinite",
            { status: ["new"] }
        ]);
        expect(queryData).toBeDefined();
    });

    it("should handle errors when updating task fails", async () => {
        const error = new Error("Failed to update");
        (toggleTaskStatus as any).mockRejectedValue(error);

        const { result } = renderHook(() => useToggleTaskStatusMutation(), {
            wrapper: createWrapper()
        });

        await act(async () => {
            result.current.mutate("task-1");
        });

        expect(result.current.isError).toBe(true);
        expect(result.current.error).toBe(error);

        const queryData = queryClient.getQueryData([
            "tasks",
            "infinite",
            { status: ["new"] }
        ]);
        expect(queryData).toEqual(mockQueryData);
    });
});

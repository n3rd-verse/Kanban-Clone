import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { useDeleteTaskMutation } from "../use-delete-task-mutation";
import { deleteTask } from "@/services/tasks";

vi.mock("@/services/tasks", () => ({
    deleteTask: vi.fn()
}));

const mockToast = vi.fn();
vi.mock("@/components/ui/use-toast", () => ({
    useToast: () => ({
        toast: mockToast
    })
}));

vi.mock("react-i18next", () => ({
    useTranslation: () => ({
        t: (key: string) => key
    })
}));

describe("useDeleteTaskMutation", () => {
    let queryClient: QueryClient;

    beforeEach(() => {
        queryClient = new QueryClient({
            defaultOptions: {
                queries: {
                    retry: false
                }
            }
        });
        vi.clearAllMocks();
    });

    const wrapper = ({ children }: { children: React.ReactNode }) => (
        <QueryClientProvider client={queryClient}>
            {children}
        </QueryClientProvider>
    );

    it("should handle errors and show error toast", async () => {
        const error = new Error("Failed to delete task");
        (deleteTask as any).mockRejectedValue(error);

        const { result } = renderHook(() => useDeleteTaskMutation(), {
            wrapper
        });

        await act(async () => {
            result.current.mutate("task-1");
        });

        expect(mockToast).toHaveBeenCalledWith({
            variant: "destructive",
            title: "toast.titles.error",
            description: "Failed to delete task"
        });

        expect(deleteTask).toHaveBeenCalledWith("task-1");
    });

    it("should successfully delete task and invalidate queries", async () => {
        (deleteTask as any).mockResolvedValue(undefined);

        const { result } = renderHook(() => useDeleteTaskMutation(), {
            wrapper
        });

        await act(async () => {
            result.current.mutate("task-1");
        });

        expect(queryClient.isFetching()).toBe(0);
    });
});

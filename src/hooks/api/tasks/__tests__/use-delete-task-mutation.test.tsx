import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useDeleteTaskMutation } from "../use-delete-task-mutation";
import { deleteTask } from "@/services/tasks";
import { TaskStatus } from "@/constants/task-status";

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

    const mockTasks = {
        pages: [
            {
                tasks: [
                    { id: "task-1", title: "Task 1", status: TaskStatus.NEW },
                    { id: "task-2", title: "Task 2", status: TaskStatus.NEW }
                ],
                total: 2
            }
        ],
        pageParams: [0]
    };

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

    it("should optimistically remove task and handle successful deletion", async () => {
        queryClient.setQueryData(["tasks"], mockTasks);
        (deleteTask as any).mockResolvedValueOnce("success");

        const { result } = renderHook(() => useDeleteTaskMutation(), {
            wrapper
        });

        await result.current.mutateAsync({ id: "task-1", title: "Task 1" });

        // Check if task was immediately removed (optimistic update)
        const currentData: any = queryClient.getQueryData(["tasks"]);
        expect(currentData.pages[0].tasks).toHaveLength(1);
        expect(currentData.pages[0].tasks[0].id).toBe("task-2");
        expect(currentData.pages[0].total).toBe(1);
    });

    it("should revert optimistic update and show error toast on failure", async () => {
        queryClient.setQueryData(["tasks"], mockTasks);

        const error = new Error("Failed to delete task");
        (deleteTask as any).mockRejectedValueOnce(error);

        const { result } = renderHook(() => useDeleteTaskMutation(), {
            wrapper
        });

        // Trigger mutation
        await result.current
            .mutateAsync({ id: "task-1", title: "Task 1" })
            .catch(() => {});

        // Check if data was reverted
        const currentData: any = queryClient.getQueryData(["tasks"]);
        expect(currentData.pages[0].tasks).toHaveLength(2);
        expect(currentData.pages[0].total).toBe(2);

        expect(mockToast).toHaveBeenCalledWith({
            variant: "destructive",
            title: "toast.titles.error",
            description: 'Failed to delete task - Task: "Task 1"'
        });
    });

    it("should handle multiple queries and restore all of them on error", async () => {
        const newTasksQuery = ["tasks", { status: [TaskStatus.NEW] }];
        const completedTasksQuery = [
            "tasks",
            { status: [TaskStatus.COMPLETED] }
        ];

        const newTasks = {
            pages: [
                { tasks: [{ id: "task-1", status: TaskStatus.NEW }], total: 1 }
            ],
            pageParams: [0]
        };

        const completedTasks = {
            pages: [
                {
                    tasks: [{ id: "task-2", status: TaskStatus.COMPLETED }],
                    total: 1
                }
            ],
            pageParams: [0]
        };

        queryClient.setQueryData(newTasksQuery, newTasks);
        queryClient.setQueryData(completedTasksQuery, completedTasks);

        const error = new Error("Failed to delete task");
        (deleteTask as any).mockRejectedValueOnce(error);

        const { result } = renderHook(() => useDeleteTaskMutation(), {
            wrapper
        });

        await result.current
            .mutateAsync({ id: "task-1", title: "Task 1" })
            .catch(() => {});

        const currentNewTasks: any = queryClient.getQueryData(newTasksQuery);
        const currentCompletedTasks: any =
            queryClient.getQueryData(completedTasksQuery);

        expect(currentNewTasks.pages[0].tasks).toHaveLength(1);
        expect(currentCompletedTasks.pages[0].tasks).toHaveLength(1);
    });

    it("should handle empty or undefined query data", async () => {
        const error = new Error("Failed to delete task");
        (deleteTask as any).mockRejectedValueOnce(error);

        const { result } = renderHook(() => useDeleteTaskMutation(), {
            wrapper
        });

        await result.current
            .mutateAsync({ id: "task-1", title: "Task 1" })
            .catch(() => {});

        expect(mockToast).toHaveBeenCalledWith({
            variant: "destructive",
            title: "toast.titles.error",
            description: 'Failed to delete task - Task: "Task 1"'
        });
    });
});

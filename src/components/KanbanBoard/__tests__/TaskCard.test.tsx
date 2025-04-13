import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { TaskCard } from "../tasks";
import { useDeleteTaskMutation } from "@/hooks/api/tasks/use-delete-task-mutation";
import { useToggleTaskStatusMutation } from "@/hooks/api/tasks/use-toggle-task-status-mutation";
import { useOpenTaskMutation } from "@/hooks/api/tasks/use-open-task-mutation";
import { TaskStatus } from "@/constants/task-status";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

vi.mock("@/hooks/api/tasks/use-delete-task-mutation", () => ({
    useDeleteTaskMutation: vi.fn()
}));

vi.mock("@/hooks/api/tasks/use-toggle-task-status-mutation", () => ({
    useToggleTaskStatusMutation: vi.fn()
}));

vi.mock("@/hooks/api/tasks/use-open-task-mutation", () => ({
    useOpenTaskMutation: vi.fn()
}));

vi.mock("@/components/KanbanBoard/ContactAddress", () => ({
    ContactAddress: ({
        address,
        showSeparator
    }: {
        address: { name: string; email: string };
        showSeparator: boolean;
    }) => <span data-testid="contact-address">{address.name}</span>
}));

vi.mock("../CardDeleteButton", () => ({
    CardDeleteButton: ({ onClick }: { onClick: () => void }) => (
        <button onClick={onClick} data-testid="delete-button">
            Delete
        </button>
    )
}));

vi.spyOn(window, "confirm").mockImplementation(() => true);

vi.mock("react-i18next", () => ({
    useTranslation: () => ({
        t: (key: string) => key,
        i18n: {
            changeLanguage: vi.fn()
        }
    })
}));

describe("TaskCard", () => {
    const deleteMock = vi.fn();
    const toggleMock = vi.fn();
    const openMock = vi.fn();

    const mockTask = {
        id: "task-1",
        title: "Test Task",
        status: TaskStatus.NEW,
        assignee: [{ name: "John Doe", email: "john@example.com" }],
        date: "2023-01-01T12:00:00Z",
        allowEdit: false,
        assignedMe: false // 필수 속성 추가
    };

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

        (useDeleteTaskMutation as any).mockReturnValue({
            mutate: deleteMock
        });
        (useToggleTaskStatusMutation as any).mockReturnValue({
            mutate: toggleMock
        });
        (useOpenTaskMutation as any).mockReturnValue({
            mutate: openMock
        });
    });

    it("renders task title correctly", () => {
        render(<TaskCard task={mockTask} />, { wrapper: createWrapper() });
        expect(screen.getByText("Test Task")).toBeInTheDocument();
    });

    it("renders assignees correctly", () => {
        render(<TaskCard task={mockTask} />, { wrapper: createWrapper() });
        expect(screen.getByText("John Doe")).toBeInTheDocument();
    });

    it("renders formatted date for non-completed tasks", () => {
        render(<TaskCard task={mockTask} />, { wrapper: createWrapper() });
        expect(screen.getByText("Jan 01, 2023")).toBeInTheDocument();
    });

    it("does not render date for completed tasks", () => {
        const completedTask = {
            ...mockTask,
            status: TaskStatus.COMPLETED
        };
        render(<TaskCard task={completedTask} />, { wrapper: createWrapper() });
        expect(screen.queryByText("Jan 01, 2023")).not.toBeInTheDocument();
    });

    it("calls delete mutation when delete button is clicked", async () => {
        render(<TaskCard task={mockTask} />, { wrapper: createWrapper() });

        const deleteButton = screen.getByTestId("delete-button");
        fireEvent.click(deleteButton);

        await waitFor(() => {
            expect(deleteMock).toHaveBeenCalledWith({
                id: "task-1",
                title: "Test Task"
            });
        });
    });

    it("calls toggle mutation when checkbox is clicked", async () => {
        render(<TaskCard task={mockTask} />, { wrapper: createWrapper() });

        const checkbox = screen.getByRole("checkbox");
        fireEvent.click(checkbox);

        await waitFor(() => {
            expect(toggleMock).toHaveBeenCalledWith("task-1");
        });
    });

    it("does not allow toggling if task has allowEdit=true", () => {
        const nonEditableTask = {
            ...mockTask,
            allowEdit: true
        };
        render(<TaskCard task={nonEditableTask} />, {
            wrapper: createWrapper()
        });

        const checkbox = screen.getByRole("checkbox");
        expect(checkbox).toBeDisabled();
    });

    it("calls open task mutation when card is clicked", async () => {
        render(<TaskCard task={mockTask} />, { wrapper: createWrapper() });

        const card = screen.getByText("Test Task").closest(".p-4");
        fireEvent.click(card as HTMLElement);

        await waitFor(() => {
            expect(openMock).toHaveBeenCalledWith("task-1");
        });
    });

    it("renders AI info when present", () => {
        const taskWithAi = {
            ...mockTask,
            ai: {
                topic: "Meeting",
                summary: "Team standup"
            }
        };
        render(<TaskCard task={taskWithAi} />, { wrapper: createWrapper() });

        expect(screen.getByText("Meeting")).toBeInTheDocument();
        expect(screen.getByText("Team standup")).toBeInTheDocument();
    });
});

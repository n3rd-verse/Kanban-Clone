import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { useDeleteScheduleMutation } from "../use-delete-schedule-mutation";
import { deleteSchedule } from "@/services/schedules";

vi.mock("@/services/schedules", () => ({
    deleteSchedule: vi.fn()
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

describe("useDeleteScheduleMutation", () => {
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
        const error = new Error("Failed to delete schedule");
        (deleteSchedule as any).mockRejectedValueOnce(error);

        const { result } = renderHook(() => useDeleteScheduleMutation(), {
            wrapper
        });

        await act(async () => {
            await result.current.mutateAsync("schedule-1").catch(() => {});
        });

        expect(mockToast).toHaveBeenCalledWith({
            variant: "destructive",
            title: "toast.titles.error",
            description: "Failed to delete schedule"
        });

        expect(deleteSchedule).toHaveBeenCalledWith("schedule-1");
    });
});

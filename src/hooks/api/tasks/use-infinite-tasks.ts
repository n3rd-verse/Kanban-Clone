import { useSuspenseInfiniteQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/query-keys";
import { fetchTasks } from "@/services/tasks";
import type { TaskFilters } from "@/types/task";
import { useToast } from "@/components/ui/use-toast";
import { TASK_PAGE_SIZE } from "@/constants/pagination";
import { ERROR_MESSAGES, TOAST_MESSAGES } from "@/constants/messages";

export function useInfiniteTasks(filters: TaskFilters = {}) {
    const { toast } = useToast();

    return useSuspenseInfiniteQuery({
        queryKey: queryKeys.tasks.infinite(filters),
        queryFn: async ({ pageParam = 0 }) => {
            try {
                return await fetchTasks({
                    ...filters,
                    page: pageParam,
                    limit: TASK_PAGE_SIZE
                });
            } catch (error: any) {
                const errorMessage =
                    error.response?.data?.message ||
                    error.message ||
                    ERROR_MESSAGES.UNKNOWN_ERROR;
                toast({
                    variant: "destructive",
                    title: TOAST_MESSAGES.TITLES.DATA_LOAD_FAILED,
                    description: errorMessage
                });
                throw new Error(errorMessage);
            }
        },
        initialPageParam: 0,
        getNextPageParam: (lastPage) => lastPage.nextPage,
        staleTime: 6000,
        retry: 2,
        retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000)
    });
}

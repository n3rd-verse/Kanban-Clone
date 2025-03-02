import { useInfiniteQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/query-keys";
import { fetchTasks } from "@/services/tasks";
import type { TaskFilters } from "@/types/task";

export function useInfiniteTasks(filters: TaskFilters = {}) {
    return useInfiniteQuery({
        queryKey: queryKeys.tasks.infinite(filters),
        queryFn: async ({ pageParam = 0 }) => {
            try {
                return await fetchTasks({
                    ...filters,
                    page: pageParam,
                    limit: 30
                });
            } catch (error: any) {
                throw new Error(`Failed to fetch tasks: ${error.message}`);
            }
        },
        initialPageParam: 0,
        getNextPageParam: (lastPage) => lastPage.nextPage,
        staleTime: 6000,
        retry: 2,
        retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000)
    });
}

import { useInfiniteQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/query-keys";
import { fetchTasks } from "@/services/tasks";
import type { TaskFilters } from "@/types/task";

export function useInfiniteTasks(filters: TaskFilters = {}) {
    return useInfiniteQuery({
        queryKey: queryKeys.tasks.infinite(filters),
        queryFn: async ({ pageParam = 0 }) => {
            return fetchTasks({
                ...filters,
                page: pageParam,
                limit: 20
            });
        },
        initialPageParam: 0,
        getNextPageParam: (lastPage) => lastPage.nextPage
    });
}

import { useSuspenseInfiniteQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/query-keys";
import { fetchTasks } from "@/services/tasks";
import type { TaskFilters } from "@/types/task";
import { useToast } from "@/components/ui/use-toast";
import { TASK_PAGE_SIZE } from "@/constants/pagination";
import { useTranslation } from "react-i18next";

/**
 * Hook for fetching tasks in an infinite scrolling list with React Query suspense.
 * @param filters - Optional TaskFilters to apply for fetching.
 * @returns An infinite query object including pages, fetchNextPage, hasNextPage, and error.
 */
export function useInfiniteTasks(filters: TaskFilters = {}) {
    const { toast } = useToast();
    const { t } = useTranslation();

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
                    t("errors.unknownError");
                toast({
                    variant: "destructive",
                    title: t("toast.titles.dataLoadFailed"),
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

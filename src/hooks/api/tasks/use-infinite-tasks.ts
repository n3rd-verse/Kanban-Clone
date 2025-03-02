import { useSuspenseInfiniteQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/query-keys";
import { fetchTasks } from "@/services/tasks";
import type { TaskFilters } from "@/types/task";
import { useToast } from "@/components/ui/use-toast";

export function useInfiniteTasks(filters: TaskFilters = {}) {
    const { toast } = useToast();

    return useSuspenseInfiniteQuery({
        queryKey: queryKeys.tasks.infinite(filters),
        queryFn: async ({ pageParam = 0 }) => {
            try {
                return await fetchTasks({
                    ...filters,
                    page: pageParam,
                    limit: 30
                });
            } catch (error: any) {
                const errorMessage =
                    error.response?.data?.message ||
                    error.message ||
                    "알 수 없는 오류가 발생했습니다.";
                toast({
                    variant: "destructive",
                    title: "데이터 로드 실패",
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

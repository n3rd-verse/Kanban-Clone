import { queryClient } from "./query-config";
import { queryKeys } from "./query-keys";
import type { TaskFilters, TasksResponse } from "@/types/task";
import { fetchTasks } from "@/services/tasks";
import { TaskStatus } from "@/constants/task-status";

export const queryStrategies = {
    tasks: {
        prefetch: {
            all: async () => {
                await queryClient.prefetchQuery({
                    queryKey: queryKeys.tasks.all(),
                    queryFn: () => fetchTasks()
                });
            },

            list: async (filters: TaskFilters) => {
                await queryClient.prefetchQuery({
                    queryKey: queryKeys.tasks.list(filters),
                    queryFn: () => fetchTasks(filters)
                });
            }
        },

        ensure: {
            infinite: async (status: TaskStatus) => {
                return queryClient.ensureInfiniteQueryData({
                    queryKey: queryKeys.tasks.infinite({ status: [status] }),
                    queryFn: ({ pageParam = 0 }) =>
                        fetchTasks({
                            status: [status],
                            page: pageParam,
                            limit: 20
                        }),
                    initialPageParam: 0,
                    getNextPageParam: (lastPage: TasksResponse) =>
                        lastPage.nextPage
                });
            }
        },

        invalidate: {
            all: async () => {
                await queryClient.invalidateQueries({
                    queryKey: queryKeys.tasks.root
                });
            },

            list: async (filters?: TaskFilters) => {
                await queryClient.invalidateQueries({
                    queryKey: queryKeys.tasks.list(filters ?? {})
                });
            }
        }
    }
};

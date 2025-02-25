import { queryClient } from "./query-config";
import { queryKeys } from "./query-keys";
import type { TaskFilters } from "@/types/task";
import { fetchTasks } from "@/services/tasks";

export const prefetchStrategies = {
    tasks: {
        all: async () => {
            await queryClient.prefetchQuery({
                queryKey: queryKeys.tasks.all(),
                queryFn: fetchTasks
            });
        },

        list: async (filters: TaskFilters) => {
            await queryClient.prefetchQuery({
                queryKey: queryKeys.tasks.list(filters),
                queryFn: () => fetchTasksList(filters)
            });
        },

        detail: async (id: string) => {
            await queryClient.prefetchQuery({
                queryKey: queryKeys.tasks.detail(id),
                queryFn: () => fetchTaskDetail(id)
            });
        }
    }
};

export const invalidationStrategies = {
    tasks: {
        all: async () => {
            await queryClient.invalidateQueries({
                queryKey: queryKeys.tasks.root
            });
        },

        detail: async (id: string) => {
            await queryClient.invalidateQueries({
                queryKey: queryKeys.tasks.detail(id)
            });
        },

        list: async (filters?: TaskFilters) => {
            await queryClient.invalidateQueries({
                queryKey: queryKeys.tasks.list(filters ?? {})
            });
        }
    }
};

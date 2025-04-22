import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/query-keys";
import { fetchTasks } from "@/services/tasks";

/**
 * Fetches all tasks using React Query.
 * @returns A query object containing task data, loading status, and errors.
 */
export function useTasks() {
    return useQuery({
        queryKey: queryKeys.tasks.all(),
        queryFn: () => fetchTasks()
    });
}

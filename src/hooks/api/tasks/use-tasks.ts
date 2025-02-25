import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/query-keys";
import { fetchTasks } from "@/services/tasks";

export function useTasks() {
    return useQuery({
        queryKey: queryKeys.tasks.all(),
        queryFn: () => fetchTasks()
    });
}

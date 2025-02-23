import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/query-keys";
import { fetchTasks } from "@/services/tasks";

export function useTasksQuery() {
    return useQuery({
        queryKey: queryKeys.tasks.all(),
        queryFn: fetchTasks
    });
}

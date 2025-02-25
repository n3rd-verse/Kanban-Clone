import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { queryKeys } from "@/lib/query-keys";
import { fetchTasks } from "@/services/tasks";
import { Task } from "@/types/task";

export function useTasksQuery(): UseQueryResult<Task[], Error> {
    return useQuery({
        queryKey: queryKeys.tasks.all(),
        queryFn: fetchTasks
    });
}

import { queryOptions } from "@tanstack/react-query";
import { queryKeys } from "../../../lib/query-keys";
import { fetchTasks } from "@/services/tasks";

export const tasksQueryOptions = queryOptions({
    queryKey: queryKeys.tasks.all(),
    queryFn: () => fetchTasks()
});

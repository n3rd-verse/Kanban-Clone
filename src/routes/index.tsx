import { createFileRoute } from "@tanstack/react-router";
import { KanbanBoard } from "@/components/KanbanBoard/KanbanBoard";
import { RouteErrorComponent } from "@/components/ErrorComponent";
import { z } from "zod";
import { TaskCategory } from "@/components/KanbanBoard/TaskFilter";

export const filterSchema = z.object({
    categories: z
        .array(z.nativeEnum(TaskCategory))
        .default([])
        .transform((val) => (Array.isArray(val) ? val : []))
});

export const Route = createFileRoute("/")({
    validateSearch: filterSchema,
    // loader: async () => {
    //     const statuses = ["new", "in_progress", "urgent", "completed"] as const;

    //     await Promise.all([
    //         Promise.all(
    //             statuses.map((status) =>
    //                 queryClient.ensureInfiniteQueryData({
    //                     queryKey: queryKeys.tasks.infinite({
    //                         status: [status]
    //                     }),
    //                     queryFn: ({ pageParam = 0 }) =>
    //                         fetchTasks({
    //                             status: [status],
    //                             page: pageParam,
    //                             limit: 30
    //                         }),
    //                     initialPageParam: 0,
    //                     getNextPageParam: (lastPage: TasksResponse) =>
    //                         lastPage.nextPage
    //                 })
    //             )
    //         ),
    //         queryClient.ensureQueryData({
    //             queryKey: queryKeys.schedules.all(),
    //             queryFn: fetchSchedules
    //         })
    //     ]);
    // },
    errorComponent: RouteErrorComponent,
    component: () => <KanbanBoard />
});

import { createFileRoute } from "@tanstack/react-router";
import { queryClient } from "@/lib/query-config";
import { queryKeys } from "@/lib/query-keys";
import { fetchTasks } from "@/services/tasks";
import { fetchSchedules } from "@/services/schedules";
import { KanbanBoard } from "@/components/KanbanBoard/KanbanBoard";
import { Suspense } from "react";
import { TasksResponse } from "@/types/task";
import { ColumnSkeleton } from "@/components/KanbanBoard/KanbanBoardSkeleton";
import { ScheduleColumnSkeleton } from "@/components/KanbanBoard/KanbanBoardSkeleton";
import { RouteErrorComponent } from "@/components/ErrorComponent";
import { z } from "zod";

export const filterSchema = z.object({
    filters: z
        .array(z.enum(["important", "company", "news", "other"]))
        .default([])
        .transform((val) => (Array.isArray(val) ? val : []))
});

export const Route = createFileRoute("/")({
    validateSearch: filterSchema,
    loader: async () => {
        const statuses = ["new", "in_progress", "urgent", "completed"] as const;

        await Promise.all([
            Promise.all(
                statuses.map((status) =>
                    queryClient.ensureInfiniteQueryData({
                        queryKey: queryKeys.tasks.infinite({
                            status: [status]
                        }),
                        queryFn: ({ pageParam = 0 }) =>
                            fetchTasks({
                                status: [status],
                                page: pageParam,
                                limit: 30
                            }),
                        initialPageParam: 0,
                        getNextPageParam: (lastPage: TasksResponse) =>
                            lastPage.nextPage
                    })
                )
            ),
            queryClient.ensureQueryData({
                queryKey: queryKeys.schedules.all(),
                queryFn: fetchSchedules
            })
        ]);
    },
    errorComponent: RouteErrorComponent,
    component: () => (
        <Suspense
            fallback={
                <div className="p-4 min-h-screen">
                    <div className="flex xl:flex-row flex-col">
                        <div className="flex-1">
                            <div className="gap-4 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4">
                                {[
                                    "new",
                                    "in_progress",
                                    "urgent",
                                    "completed"
                                ].map((status) => (
                                    <ColumnSkeleton key={status} />
                                ))}
                            </div>
                        </div>
                        <div className="xl:w-[400px]">
                            <ScheduleColumnSkeleton />
                        </div>
                    </div>
                </div>
            }
        >
            <KanbanBoard />
        </Suspense>
    )
});

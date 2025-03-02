import { createFileRoute } from "@tanstack/react-router";
import { queryClient } from "@/lib/query-config";
import { queryKeys } from "@/lib/query-keys";
import { fetchTasks } from "@/services/tasks";
import { fetchSchedules } from "@/services/schedules";
import { KanbanBoard } from "@/components/home/KanbanBoard/KanbanBoard";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { ColumnSkeleton } from "@/components/home/KanbanBoard/KanbanBoardSkeleton";
import { Suspense } from "react";
import { TasksResponse } from "@/types/task";
import { ScheduleColumnSkeleton } from "@/components/home/KanbanBoard/KanbanBoardSkeleton";

export const Route = createFileRoute("/")({
    loader: async () => {
        const statuses = ["new", "in_progress", "urgent", "completed"] as const;

        await Promise.all([
            // Tasks 데이터 로드
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
            // Schedules 데이터 로드
            queryClient.ensureQueryData({
                queryKey: queryKeys.schedules.all(),
                queryFn: fetchSchedules
            })
        ]);
    },
    component: () => (
        <ErrorBoundary fallback={<div>Error loading tasks</div>}>
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
        </ErrorBoundary>
    )
});

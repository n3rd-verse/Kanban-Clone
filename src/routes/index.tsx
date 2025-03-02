import { createFileRoute } from "@tanstack/react-router";
import { queryClient } from "@/lib/query-config";
import { queryKeys } from "@/lib/query-keys";
import { fetchTasks } from "@/services/tasks";
import { KanbanBoard } from "@/components/home/KanbanBoard/KanbanBoard";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { ColumnSkeleton } from "@/components/home/KanbanBoard/KanbanBoardSkeleton";
import { Suspense } from "react";
import { TasksResponse } from "@/types/task";

export const Route = createFileRoute("/")({
    loader: async () => {
        const statuses = ["new", "in_progress", "urgent", "completed"] as const;

        await Promise.all(
            statuses.map((status) =>
                queryClient.ensureInfiniteQueryData({
                    queryKey: queryKeys.tasks.infinite({ status: [status] }),
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
        );
    },
    component: () => (
        <ErrorBoundary fallback={<div>Error loading tasks</div>}>
            <Suspense
                fallback={
                    <div className="min-h-screen">
                        <div className="gap-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
                            {["new", "in_progress", "urgent", "completed"].map(
                                (status) => (
                                    <ColumnSkeleton key={status} />
                                )
                            )}
                        </div>
                    </div>
                }
            >
                <KanbanBoard />
            </Suspense>
        </ErrorBoundary>
    )
});

import { createFileRoute } from "@tanstack/react-router";
import { KanbanBoard } from "@/components/home/KanbanBoard/KanbanBoard";
import { queryClient } from "@/lib/query-config";
import { tasksQueryOptions } from "@/hooks/api/tasks/task-query-options";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { ColumnSkeleton } from "@/components/home/KanbanBoard/KanbanBoardSkeleton";
import { Suspense } from "react";

export const Route = createFileRoute("/")({
    loader: async () => {
        await queryClient.ensureQueryData(tasksQueryOptions);
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

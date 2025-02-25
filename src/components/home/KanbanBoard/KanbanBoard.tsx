import type { TaskStatus } from "@/types/task";
import { TaskCard } from "./TaskCard";
import { useTranslation } from "react-i18next";
import { useInfiniteTasks } from "@/hooks/api/tasks/use-infinite-tasks";
import { useVirtualizer } from "@tanstack/react-virtual";
import { useRef } from "react";
import { taskTransformers } from "@/lib/transformers/task.transformer";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { QueryErrorBoundary } from "@/components/ErrorBoundary";
import { Suspense } from "react";
import { ColumnSkeleton } from "./KanbanBoardSkeleton";

const statusColors = {
    new: "text-[#3b82f6] bg-blue-50",
    in_progress: "text-[#fbbf24] bg-amber-50",
    urgent: "text-[#ef4444] bg-red-50",
    completed: "text-[#22c55e] bg-green-50"
};

function TaskColumn({ status }: { status: TaskStatus }) {
    const { t } = useTranslation();
    const columnRef = useRef<HTMLDivElement>(null);
    const { data, isFetchingNextPage, hasNextPage, fetchNextPage } =
        useInfiniteTasks({
            status: [status]
        });

    const tasks = data?.pages.flatMap((p) => p.tasks) ?? [];

    const virtualizer = useVirtualizer({
        count: tasks.length,
        getScrollElement: () => columnRef.current,
        estimateSize: () => 100,
        overscan: 5
    });

    // Handle infinite scroll
    const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
        const target = e.target as HTMLDivElement;
        if (
            !isFetchingNextPage &&
            hasNextPage &&
            target.scrollHeight - target.scrollTop <= target.clientHeight * 1.5
        ) {
            fetchNextPage();
        }
    };

    return (
        <div className="flex flex-col gap-4">
            <div className="flex justify-between items-center">
                <div
                    className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg ${statusColors[status]}`}
                >
                    <h3 className="font-medium">{t(`status.${status}`)}</h3>
                    <span className="text-sm">({tasks.length})</span>
                </div>
            </div>
            <div
                ref={columnRef}
                className="flex-1 px-1 overflow-auto scrollbar-hide hover:scrollbar-default"
                style={{ height: "calc(100vh - 200px)" }}
                onScroll={handleScroll}
            >
                <div
                    style={{
                        height: `${virtualizer.getTotalSize()}px`,
                        position: "relative"
                    }}
                >
                    {virtualizer.getVirtualItems().map((virtualItem) => {
                        const task = tasks[virtualItem.index];
                        if (!task) return null;

                        return (
                            <div
                                key={task.id}
                                style={{
                                    position: "absolute",
                                    top: 0,
                                    left: 0,
                                    width: "100%",
                                    height: `${virtualItem.size}px`,
                                    transform: `translateY(${virtualItem.start}px)`,
                                    padding: "6px 0" // Add padding between cards
                                }}
                            >
                                <TaskCard
                                    task={taskTransformers.fromDTO(task)}
                                />
                            </div>
                        );
                    })}
                </div>
                {isFetchingNextPage && <LoadingSpinner className="mt-4" />}
            </div>
        </div>
    );
}

export function KanbanBoard() {
    const statuses = ["new", "in_progress", "urgent", "completed"] as const;

    return (
        <div className="min-h-screen">
            <div className="gap-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
                {statuses.map((status) => (
                    <QueryErrorBoundary key={status}>
                        <Suspense
                            fallback={
                                <div className="animate-pulse">
                                    <ColumnSkeleton />
                                </div>
                            }
                        >
                            <TaskColumn status={status} />
                        </Suspense>
                    </QueryErrorBoundary>
                ))}
            </div>
        </div>
    );
}

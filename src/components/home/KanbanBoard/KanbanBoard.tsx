import type { TaskStatus } from "@/types/task";
import { TaskCard } from "./TaskCard";
import { useTranslation } from "react-i18next";
import { useInfiniteTasks } from "@/hooks/api/tasks/use-infinite-tasks";
import { useVirtualizer } from "@tanstack/react-virtual";
import { useRef, useCallback, useEffect } from "react";
import { taskTransformers } from "@/lib/transformers/task.transformer";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { QueryErrorBoundary } from "@/components/ErrorBoundary";
import { Suspense } from "react";
import { ColumnSkeleton } from "./KanbanBoardSkeleton";
import { ScheduleColumn } from "../ScheduleColumn/ScheduleColumn";

const statusColors = {
    new: "text-[#3b82f6] bg-blue-50",
    in_progress: "text-[#fbbf24] bg-amber-50",
    urgent: "text-[#ef4444] bg-red-50",
    completed: "text-[#22c55e] bg-green-50"
};

function TaskColumn({ status }: { status: TaskStatus }) {
    const { t } = useTranslation();
    const columnRef = useRef<HTMLDivElement>(null);
    const loadMoreRef = useRef<HTMLDivElement>(null);
    const { data, isFetchingNextPage, hasNextPage, fetchNextPage } =
        useInfiniteTasks({
            status: [status]
        });

    const tasks = data?.pages.flatMap((p) => p.tasks) ?? [];

    const virtualizer = useVirtualizer({
        count: tasks.length,
        getScrollElement: () => columnRef.current,
        estimateSize: () => 180,
        overscan: 10,
        paddingStart: 16,
        paddingEnd: 16,
        measureElement: (element) => {
            if (!element) return 0;
            const rect = element.getBoundingClientRect();
            return rect.height;
        }
    });

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (
                    entries[0].isIntersecting &&
                    hasNextPage &&
                    !isFetchingNextPage
                ) {
                    fetchNextPage();
                }
            },
            {
                rootMargin: "200px",
                threshold: 0.1
            }
        );

        if (loadMoreRef.current) {
            observer.observe(loadMoreRef.current);
        }

        return () => observer.disconnect();
    }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

    return (
        <div className="flex flex-col gap-2 h-full">
            <div className="flex justify-between items-center">
                <div
                    className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg ${statusColors[status]}`}
                >
                    <h3 className="font-medium">{t(`status.${status}`)}</h3>
                    <span className="text-sm">({tasks.length})</span>
                </div>
            </div>
            <div
                ref={columnRef}
                className="flex-1 px-2 overflow-x-hidden overflow-y-auto"
                style={{
                    height: "calc(100vh - 200px)",
                    position: "relative"
                }}
            >
                <div
                    className="relative w-full"
                    style={{
                        height: `${virtualizer.getTotalSize()}px`
                    }}
                >
                    {virtualizer.getVirtualItems().map((virtualItem) => {
                        const task = tasks[virtualItem.index];
                        if (!task) return null;

                        return (
                            <div
                                key={task.id}
                                data-index={virtualItem.index}
                                className="left-0 absolute w-full"
                                style={{
                                    top: `${virtualItem.start}px`,
                                    height: "auto",
                                    padding: "8px 0"
                                }}
                            >
                                <TaskCard
                                    task={taskTransformers.fromDTO(task)}
                                />
                            </div>
                        );
                    })}
                </div>
                <div ref={loadMoreRef} className="h-5" />
                {isFetchingNextPage && <LoadingSpinner className="mt-4" />}
            </div>
        </div>
    );
}

export function KanbanBoard() {
    const statuses = ["new", "in_progress", "urgent", "completed"] as const;

    return (
        <div className="flex flex-col gap-2 lg:grid lg:grid-cols-5">
            <div className="flex-1 lg:col-span-4">
                <div className="gap-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
                    <QueryErrorBoundary key={statuses[0]}>
                        <Suspense
                            fallback={
                                <div className="animate-pulse">
                                    <ColumnSkeleton />
                                </div>
                            }
                        >
                            <TaskColumn status={statuses[0]} />
                        </Suspense>
                    </QueryErrorBoundary>
                    <QueryErrorBoundary key={statuses[1]}>
                        <Suspense
                            fallback={
                                <div className="animate-pulse">
                                    <ColumnSkeleton />
                                </div>
                            }
                        >
                            <TaskColumn status={statuses[1]} />
                        </Suspense>
                    </QueryErrorBoundary>

                    <QueryErrorBoundary key={statuses[2]}>
                        <Suspense
                            fallback={
                                <div className="animate-pulse">
                                    <ColumnSkeleton />
                                </div>
                            }
                        >
                            <TaskColumn status={statuses[2]} />
                        </Suspense>
                    </QueryErrorBoundary>
                    <QueryErrorBoundary key={statuses[3]}>
                        <Suspense
                            fallback={
                                <div className="animate-pulse">
                                    <ColumnSkeleton />
                                </div>
                            }
                        >
                            <TaskColumn status={statuses[3]} />
                        </Suspense>
                    </QueryErrorBoundary>
                </div>
            </div>
            <div className="lg:col-span-1 w-full">
                <ScheduleColumn />
            </div>
        </div>
    );
}

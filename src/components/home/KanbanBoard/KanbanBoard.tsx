import type { Task } from "@/types/task";
import { TaskCard } from "./TaskCard";
import { useTranslation } from "react-i18next";
import { useInfiniteTasks } from "@/hooks/api/tasks/use-infinite-tasks";
import { useVirtualizer } from "@tanstack/react-virtual";
import { useRef } from "react";
import { taskTransformers } from "@/lib/transformers/task.transformer";
import { LoadingSpinner } from "@/components/LoadingSpinner";

const statusColors = {
    new: "text-[#3b82f6] bg-blue-50",
    in_progress: "text-[#fbbf24] bg-amber-50",
    urgent: "text-[#ef4444] bg-red-50",
    completed: "text-[#22c55e] bg-green-50"
};

export function KanbanBoard() {
    const { t } = useTranslation();

    // Create a virtualizer for each status column
    const columnRefs = {
        new: useRef<HTMLDivElement>(null),
        in_progress: useRef<HTMLDivElement>(null),
        urgent: useRef<HTMLDivElement>(null),
        completed: useRef<HTMLDivElement>(null)
    };

    const queries = {
        new: useInfiniteTasks({ status: ["new"] }),
        in_progress: useInfiniteTasks({ status: ["in_progress"] }),
        urgent: useInfiniteTasks({ status: ["urgent"] }),
        completed: useInfiniteTasks({ status: ["completed"] })
    };

    const virtualizers = {
        new: useVirtualizer({
            count: queries.new.data?.pages.flatMap((p) => p.tasks).length ?? 0,
            getScrollElement: () => columnRefs.new.current,
            estimateSize: () => 100,
            overscan: 5
        }),
        in_progress: useVirtualizer({
            count:
                queries.in_progress.data?.pages.flatMap((p) => p.tasks)
                    .length ?? 0,
            getScrollElement: () => columnRefs.in_progress.current,
            estimateSize: () => 100,
            overscan: 5
        }),
        urgent: useVirtualizer({
            count:
                queries.urgent.data?.pages.flatMap((p) => p.tasks).length ?? 0,
            getScrollElement: () => columnRefs.urgent.current,
            estimateSize: () => 100,
            overscan: 5
        }),
        completed: useVirtualizer({
            count:
                queries.completed.data?.pages.flatMap((p) => p.tasks).length ??
                0,
            getScrollElement: () => columnRefs.completed.current,
            estimateSize: () => 100,
            overscan: 5
        })
    };

    return (
        <div className="min-h-screen">
            <div className="gap-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
                {(["new", "in_progress", "urgent", "completed"] as const).map(
                    (status) => (
                        <div key={status} className="flex flex-col gap-4">
                            <div
                                className={`flex items-center gap-2 px-4 py-2 rounded-lg ${statusColors[status]}`}
                            >
                                <h3 className="font-medium">
                                    {t(`status.${status}`)}
                                </h3>
                                <span className="text-sm">
                                    (
                                    {queries[status].data?.pages.flatMap(
                                        (p) => p.tasks
                                    ).length ?? 0}
                                    )
                                </span>
                            </div>
                            <div
                                ref={columnRefs[status]}
                                className="flex-1 overflow-auto scrollbar-hide hover:scrollbar-default"
                                style={{ height: "calc(100vh - 200px)" }}
                            >
                                <div
                                    style={{
                                        height: `${virtualizers[status].getTotalSize()}px`,
                                        position: "relative"
                                    }}
                                >
                                    {virtualizers[status]
                                        .getVirtualItems()
                                        .map((virtualItem) => {
                                            const task = queries[
                                                status
                                            ].data?.pages.flatMap(
                                                (p) => p.tasks
                                            )[virtualItem.index];
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
                                                        transform: `translateY(${virtualItem.start}px)`
                                                    }}
                                                >
                                                    <TaskCard
                                                        task={taskTransformers.fromDTO(
                                                            task
                                                        )}
                                                    />
                                                </div>
                                            );
                                        })}
                                </div>
                                {queries[status].isFetchingNextPage && (
                                    <LoadingSpinner className="mt-4" />
                                )}
                            </div>
                        </div>
                    )
                )}
            </div>
        </div>
    );
}

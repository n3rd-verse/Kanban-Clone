import { memo } from "react";
import { TaskCard } from "./TaskCard";
import { taskTransformers } from "@/lib/transformers/task.transformer";
import { cn } from "@/lib/utils";
import type { TaskDTO } from "@/types/task";
import type { useColumnVirtualizer } from "@/hooks/virtualizer";
import { useIntersectionObserver } from "@/hooks/core/use-intersection-observer";

interface VirtualizedTaskListProps {
    tasks: TaskDTO[];
    virtualizer: ReturnType<typeof useColumnVirtualizer>;
    isDesktop: boolean;
    loadMoreRef: React.RefObject<HTMLDivElement>;
    hasNextPage: boolean;
    isFetchingNextPage: boolean;
    fetchNextPage: () => void;
}

export const VirtualizedTaskList = memo(function VirtualizedTaskList({
    tasks,
    virtualizer,
    isDesktop,
    loadMoreRef,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage
}: VirtualizedTaskListProps) {
    useIntersectionObserver({
        target: loadMoreRef,
        onIntersect: fetchNextPage,
        enabled: hasNextPage && !isFetchingNextPage
    });

    return (
        <div
            className="relative w-full"
            style={{
                height: isDesktop ? "auto" : `${virtualizer.getTotalSize()}px`,
                position: isDesktop ? "static" : "relative"
            }}
        >
            {virtualizer.getVirtualItems().map((virtualItem) => {
                const task = tasks[virtualItem.index];
                if (!task) return null;

                return (
                    <div
                        key={task.id}
                        data-index={virtualItem.index}
                        className={cn(
                            "w-full",
                            isDesktop ? "relative mb-4" : "absolute left-0"
                        )}
                        style={{
                            ...(isDesktop
                                ? {}
                                : {
                                      top: `${virtualItem.start}px`,
                                      padding: "6px 0"
                                  }),
                            height: "auto",
                            minHeight: "100px"
                        }}
                    >
                        <TaskCard
                            task={taskTransformers.fromDTO(task)}
                            className="h-full break-words"
                        />
                    </div>
                );
            })}
        </div>
    );
});

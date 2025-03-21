import { RefObject, useEffect, useCallback } from "react";
import { useInfiniteTasks } from "@/hooks/api/tasks/use-infinite-tasks";
import { useColumnVirtualizer } from "@/hooks/virtualizer/core/use-column-virtualizer";
import { TaskStatus } from "@/constants/task-status";
import { COLUMN_SIZES } from "@/components/KanbanBoard/constants";

interface UseVirtualizedTasksProps {
    status: TaskStatus;
    columnRef: RefObject<HTMLDivElement>;
    loadMoreRef: RefObject<HTMLDivElement>;
    maxVisibleTasks: number;
    width: number;
}

export function useVirtualizedTasks({
    status,
    columnRef,
    loadMoreRef,
    maxVisibleTasks,
    width
}: UseVirtualizedTasksProps) {
    const { data, isFetchingNextPage, hasNextPage, fetchNextPage, error } =
        useInfiniteTasks({
            status: [status]
        });

    const tasks = data?.pages.flatMap((p) => p.tasks) ?? [];
    const virtualizer = useColumnVirtualizer({ tasks, columnRef });

    const columnStyle = {
        height:
            width >= COLUMN_SIZES.DESKTOP_BREAKPOINT
                ? "auto"
                : `${Math.min(
                      maxVisibleTasks * COLUMN_SIZES.BASE_TASK_HEIGHT +
                          COLUMN_SIZES.COLUMN_PADDING,
                      // 화면 높이의 60%로 제한하여 아래 컬럼이 보이도록 함
                      window.innerHeight * 0.6
                  )}px`,
        position: "relative" as const
    };

    const scrollbarClass =
        width >= COLUMN_SIZES.DESKTOP_BREAKPOINT
            ? "overflow-visible"
            : "overflow-y-auto";

    // Set up the intersection observer to load more items when scrolling to bottom
    const setupIntersectionObserver = useCallback(() => {
        if (!loadMoreRef.current) return;

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
            { rootMargin: "200px", threshold: 0.1 }
        );

        observer.observe(loadMoreRef.current);
        return () => observer.disconnect();
    }, [hasNextPage, isFetchingNextPage, fetchNextPage, loadMoreRef]);

    useEffect(() => {
        const cleanup = setupIntersectionObserver();
        return cleanup;
    }, [setupIntersectionObserver]);

    return {
        tasks,
        virtualizer,
        columnStyle,
        scrollbarClass,
        isFetchingNextPage,
        error,
        hasNextPage
    };
}

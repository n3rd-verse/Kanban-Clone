import { RefObject, useEffect, useMemo } from "react";
import { useInfiniteTasks } from "@/hooks/api/tasks/use-infinite-tasks";
import { useColumnVirtualizer } from "@/hooks/virtualizer/core/use-column-virtualizer";
import { TaskStatus } from "@/types/task";
import { COLUMN_SIZES } from "@/components/home/KanbanBoard/constants";

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
    const {
        data,
        isFetchingNextPage,
        hasNextPage,
        fetchNextPage,
        isLoading,
        isError,
        error
    } = useInfiniteTasks({
        status: [status]
    });

    const tasks = data?.pages.flatMap((p) => p.tasks) ?? [];
    const virtualizer = useColumnVirtualizer({ tasks, columnRef });

    const columnStyle = useMemo(
        () => ({
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
        }),
        [maxVisibleTasks, width]
    );

    const scrollbarClass =
        width >= COLUMN_SIZES.DESKTOP_BREAKPOINT
            ? "overflow-visible"
            : "overflow-y-auto";

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
            { rootMargin: "200px", threshold: 0.1 }
        );

        loadMoreRef.current && observer.observe(loadMoreRef.current);
        return () => observer.disconnect();
    }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

    return {
        tasks,
        virtualizer,
        columnStyle,
        scrollbarClass,
        isFetchingNextPage,
        isLoading,
        isError,
        error
    };
}

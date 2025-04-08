import { RefObject, useEffect, useCallback } from "react";
import { useInfiniteTasks } from "@/hooks/api/tasks/use-infinite-tasks";
import { useColumnVirtualizer } from "@/hooks/virtualizer/core/use-column-virtualizer";
import { TaskStatus } from "@/constants/task-status";
import { COLUMN_SIZES } from "@/components/KanbanBoard/utils/constants";
import { useSearch } from "@tanstack/react-router";
import { Route } from "@/routes/";
import { useTaskFilter } from "@/hooks/filter/use-task-filter";
import { useIntersectionObserver } from "@/hooks/core/use-intersection-observer";

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
    const { selectedCategories } = useTaskFilter();
    const { data, isFetchingNextPage, hasNextPage, fetchNextPage, error } =
        useInfiniteTasks({
            status: [status], // 각 column의 status에 맞는 데이터만 fetch
            categories: selectedCategories
        });

    const tasks = data?.pages.flatMap((p) => p.tasks) ?? [];
    const virtualizer = useColumnVirtualizer({ tasks, columnRef });

    // Setup infinite scrolling
    useIntersectionObserver({
        target: loadMoreRef,
        onIntersect: fetchNextPage,
        enabled: hasNextPage && !isFetchingNextPage
    });

    const columnStyle = {
        height:
            width >= COLUMN_SIZES.DESKTOP_BREAKPOINT
                ? "auto"
                : `${Math.min(
                      maxVisibleTasks * COLUMN_SIZES.BASE_TASK_HEIGHT +
                          COLUMN_SIZES.COLUMN_PADDING,
                      window.innerHeight * 0.6
                  )}px`,
        position: "relative" as const
    };

    const scrollbarClass =
        width >= COLUMN_SIZES.DESKTOP_BREAKPOINT
            ? ""
            : "scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent hover:scrollbar-thumb-gray-400";

    return {
        tasks,
        virtualizer,
        columnStyle,
        scrollbarClass,
        isFetchingNextPage,
        hasNextPage,
        fetchNextPage,
        error
    };
}

import { useVirtualizer } from "@tanstack/react-virtual";
import { RefObject, useCallback } from "react";
import { Task } from "@/types/task";
import { VIRTUALIZATION_CONFIG } from "@/components/KanbanBoard/utils/constants";

interface UseColumnVirtualizerProps {
    tasks: Task[];
    columnRef: RefObject<HTMLDivElement>;
}

/**
 * Custom hook that sets up virtualization for a column of tasks to optimize performance.
 * @param props.tasks - Array of Task objects to virtualize.
 * @param props.columnRef - Ref to the scrollable column container element.
 * @returns The virtualizer instance from @tanstack/react-virtual.
 */
export function useColumnVirtualizer({
    tasks,
    columnRef
}: UseColumnVirtualizerProps) {
    // 요소 측정을 최적화하기 위해 콜백으로 분리
    const measureElement = useCallback((element: Element | null) => {
        if (!element) return 0;
        return element.getBoundingClientRect().height;
    }, []);

    return useVirtualizer({
        count: tasks.length,
        getScrollElement: () => columnRef.current,
        estimateSize: () => VIRTUALIZATION_CONFIG.ESTIMATED_SIZE,
        overscan: VIRTUALIZATION_CONFIG.OVERSCAN,
        paddingStart: VIRTUALIZATION_CONFIG.PADDING_START,
        paddingEnd: VIRTUALIZATION_CONFIG.PADDING_END,
        measureElement
    });
}

import { useVirtualizer } from "@tanstack/react-virtual";
import { RefObject } from "react";
import { TaskDTO } from "@/types/task";
import { VIRTUALIZATION_CONFIG } from "@/components/KanbanBoard/constants";

interface UseColumnVirtualizerProps {
    tasks: TaskDTO[];
    columnRef: RefObject<HTMLDivElement>;
}

export function useColumnVirtualizer({
    tasks,
    columnRef
}: UseColumnVirtualizerProps) {
    return useVirtualizer({
        count: tasks.length,
        getScrollElement: () => columnRef.current,
        estimateSize: () => VIRTUALIZATION_CONFIG.ESTIMATED_SIZE,
        overscan: VIRTUALIZATION_CONFIG.OVERSCAN,
        paddingStart: VIRTUALIZATION_CONFIG.PADDING_START,
        paddingEnd: VIRTUALIZATION_CONFIG.PADDING_END,
        measureElement: (element) => {
            if (!element) return 0;
            return element.getBoundingClientRect().height;
        }
    });
}

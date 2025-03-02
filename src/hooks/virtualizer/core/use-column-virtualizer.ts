import { useVirtualizer } from "@tanstack/react-virtual";
import { RefObject } from "react";
import { TaskDTO } from "@/types/task";

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
        estimateSize: () => 180,
        overscan: 10,
        paddingStart: 16,
        paddingEnd: 16,
        measureElement: (element) => {
            if (!element) return 0;
            return element.getBoundingClientRect().height;
        }
    });
}

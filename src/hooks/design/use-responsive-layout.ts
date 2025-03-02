import { useMemo } from "react";
import { useWindowSize } from "@/hooks/design/use-window-size";
import { COLUMN_SIZES } from "@/components/home/KanbanBoard/constants";

export function useResponsiveLayout() {
    const { width } = useWindowSize();

    const maxVisibleTasks = useMemo(() => {
        if (width < COLUMN_SIZES.MOBILE_BREAKPOINT)
            return COLUMN_SIZES.MOBILE_MAX_TASKS;
        if (width < COLUMN_SIZES.DESKTOP_BREAKPOINT)
            return COLUMN_SIZES.TABLET_MAX_TASKS;
        return COLUMN_SIZES.DESKTOP_MAX_TASKS;
    }, [width]);

    return { width, maxVisibleTasks };
}

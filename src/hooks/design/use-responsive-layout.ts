// import { useMemo } from "react";
import { useWindowSize } from "@/hooks/design/use-window-size";
import { COLUMN_SIZES } from "@/components/KanbanBoard/utils/constants";

/**
 * Provides responsive layout metrics for the UI,
 * including current window width and maximum visible task count.
 * @returns An object containing:
 *   - width: current window width in pixels.
 *   - maxVisibleTasks: number of tasks to display based on media queries.
 */
export function useResponsiveLayout() {
    const { width } = useWindowSize();

    // const maxVisibleTasks = useMemo(() => {
    //     if (width >= COLUMN_SIZES.DESKTOP_BREAKPOINT) {
    //         return 10; // 데스크톱은 기존대로
    //     } else if (width >= COLUMN_SIZES.TABLET_BREAKPOINT) {
    //         return 4; // 태블릿은 5에서 4로 감소
    //     } else {
    //         return 3; // 모바일은 4에서 3으로 감소
    //     }
    // }, [width]);

    const maxVisibleTasks = 10;

    return {
        width,
        maxVisibleTasks
    };
}

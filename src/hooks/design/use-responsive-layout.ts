import { useMemo } from "react";
import { useWindowSize } from "@/hooks/design/use-window-size";
import { COLUMN_SIZES } from "@/components/home/KanbanBoard/constants";

export function useResponsiveLayout() {
    const { width } = useWindowSize();

    const maxVisibleTasks = useMemo(() => {
        if (width >= COLUMN_SIZES.DESKTOP_BREAKPOINT) {
            return 10; // 데스크톱은 기존대로
        } else if (width >= COLUMN_SIZES.TABLET_BREAKPOINT) {
            return 4; // 태블릿은 5에서 4로 감소
        } else {
            return 3; // 모바일은 4에서 3으로 감소
        }
    }, [width]);

    return {
        width,
        maxVisibleTasks
    };
}

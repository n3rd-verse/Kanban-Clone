import { useState, useEffect, RefObject } from "react";

interface UseTimelineContainerProps {
    scrollContainerRef: RefObject<HTMLDivElement | null>;
    targetDaysToShow?: number;
    minColumnWidth?: number;
}

interface UseTimelineContainerReturn {
    containerWidth: number;
    dayColumnWidth: number;
}

/**
 * Manages timeline container width and calculates per-day column width based on container size and target days to show.
 * @param props.scrollContainerRef - Ref to the scrollable timeline container element.
 * @param props.targetDaysToShow - Number of days to display within the container width (default: 14).
 * @param props.minColumnWidth - Minimum width of each day column in pixels (default: 80).
 * @returns An object containing:
 *   - containerWidth: current width of the container element in pixels.
 *   - dayColumnWidth: calculated width for each day column in pixels.
 */
export function useTimelineContainer({
    scrollContainerRef,
    targetDaysToShow = 14,
    minColumnWidth = 80
}: UseTimelineContainerProps): UseTimelineContainerReturn {
    const [containerWidth, setContainerWidth] = useState(0);

    // 컨테이너 너비 업데이트
    useEffect(() => {
        const updateWidth = () => {
            if (scrollContainerRef.current) {
                setContainerWidth(scrollContainerRef.current.clientWidth);
            }
        };

        // 초기 너비 계산
        updateWidth();

        // 리사이즈 시 업데이트
        window.addEventListener("resize", updateWidth);
        return () => window.removeEventListener("resize", updateWidth);
    }, [scrollContainerRef]);

    // 칼럼 너비 계산
    const dayColumnWidth =
        containerWidth === 0
            ? 94 // 기본값
            : Math.max(
                  Math.floor(containerWidth / targetDaysToShow),
                  minColumnWidth
              );

    return { containerWidth, dayColumnWidth };
}

import { RefObject, useCallback } from "react";

interface UseTimelineScrollProps {
    scrollContainerRef: RefObject<HTMLDivElement | null>;
    dayColumnWidth: number;
    daysToScroll?: number;
}

interface UseTimelineScrollReturn {
    scrollLeft: () => void;
    scrollRight: () => void;
}

/**
 * 타임라인 스크롤 기능을 제공하는 훅
 */
export function useTimelineScroll({
    scrollContainerRef,
    dayColumnWidth,
    daysToScroll = 7
}: UseTimelineScrollProps): UseTimelineScrollReturn {
    // 왼쪽으로 스크롤
    const scrollLeft = useCallback(() => {
        if (scrollContainerRef.current) {
            const scrollAmount = dayColumnWidth * daysToScroll;
            scrollContainerRef.current.scrollBy({
                left: -scrollAmount,
                behavior: "smooth"
            });
        }
    }, [scrollContainerRef, dayColumnWidth, daysToScroll]);

    // 오른쪽으로 스크롤
    const scrollRight = useCallback(() => {
        if (scrollContainerRef.current) {
            const scrollAmount = dayColumnWidth * daysToScroll;
            scrollContainerRef.current.scrollBy({
                left: scrollAmount,
                behavior: "smooth"
            });
        }
    }, [scrollContainerRef, dayColumnWidth, daysToScroll]);

    return { scrollLeft, scrollRight };
}

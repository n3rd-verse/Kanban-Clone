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
 * Provides scroll handlers to navigate a timeline view by day columns.
 * @param scrollContainerRef - Ref to the scrollable container element.
 * @param dayColumnWidth - Width of each day column in pixels.
 * @param daysToScroll - Number of day columns to scroll by (default: 7).
 * @returns Object containing scrollLeft and scrollRight functions.
 */
export function useTimelineScroll({
    scrollContainerRef,
    dayColumnWidth,
    daysToScroll = 7
}: UseTimelineScrollProps): UseTimelineScrollReturn {
    const scrollLeft = useCallback(() => {
        if (scrollContainerRef.current) {
            const scrollAmount = dayColumnWidth * daysToScroll;
            scrollContainerRef.current.scrollBy({
                left: -scrollAmount,
                behavior: "smooth"
            });
        }
    }, [scrollContainerRef, dayColumnWidth, daysToScroll]);

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

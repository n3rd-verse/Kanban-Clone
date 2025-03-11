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
 * 타임라인 컨테이너의 너비를 관리하고 칼럼 너비를 계산하는 훅
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

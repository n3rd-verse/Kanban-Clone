import { useRef, useState, useEffect } from "react";
import { useResponsiveLayout } from "@/hooks/design/use-responsive-layout";
import {
    useTimelineContainer,
    useTimelineScroll,
    useTimelineDays
} from "@/hooks/timeline";
import { TimelineControls } from "./TimelineControls";
import { TimelineHeaderRow } from "./TimelineHeaderRow";
import { TimelineGrid } from "./TimelineGrid";

export function Timeline() {
    const { width } = useResponsiveLayout();
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    // 현재 표시할 연도와 월 상태
    const [currentDate, setCurrentDate] = useState(() => new Date());

    // 타임라인 날짜 데이터 - 현재 날짜 기준 동적 생성
    const { days, dates, monthName, year } = useTimelineDays({
        year: currentDate.getFullYear(),
        month: currentDate.getMonth()
    });

    // 컨테이너 및 칼럼 너비 계산
    const { dayColumnWidth } = useTimelineContainer({
        scrollContainerRef,
        targetDaysToShow: 14
    });

    // 스크롤 기능
    const { scrollLeft, scrollRight } = useTimelineScroll({
        scrollContainerRef,
        dayColumnWidth
    });

    // 컨테이너 전체 너비
    const minContainerWidth = days.length * dayColumnWidth;

    // 이전 달로 이동
    const goToPreviousMonth = () => {
        setCurrentDate((prevDate) => {
            const newDate = new Date(prevDate);
            newDate.setMonth(prevDate.getMonth() - 1);
            return newDate;
        });
    };

    // 다음 달로 이동
    const goToNextMonth = () => {
        setCurrentDate((prevDate) => {
            const newDate = new Date(prevDate);
            newDate.setMonth(prevDate.getMonth() + 1);
            return newDate;
        });
    };

    // 월이 변경되면 스크롤을 처음으로 이동
    useEffect(() => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollLeft = 0;
        }
    }, [currentDate.getMonth(), currentDate.getFullYear()]);

    return (
        <div className="min-h-screen">
            {/* 타임라인 컨트롤 */}
            <div className="flex justify-between items-center mb-4">
                <TimelineControls
                    scrollLeft={scrollLeft}
                    scrollRight={scrollRight}
                    currentDate={currentDate}
                />

                {/* 월 변경 버튼 */}
                <div className="flex items-center gap-2">
                    <button
                        onClick={goToPreviousMonth}
                        className="bg-white hover:bg-gray-100 px-3 py-1 border rounded-md text-sm"
                    >
                        이전 달
                    </button>
                    <button
                        onClick={goToNextMonth}
                        className="bg-white hover:bg-gray-100 px-3 py-1 border rounded-md text-sm"
                    >
                        다음 달
                    </button>
                </div>
            </div>

            {/* 스크롤 컨테이너 */}
            <div
                ref={scrollContainerRef}
                className="overflow-x-auto scrollbar-hide"
                style={{
                    WebkitOverflowScrolling: "touch",
                    scrollSnapType: "x mandatory"
                }}
            >
                <div style={{ minWidth: `${minContainerWidth}px` }}>
                    {/* 타임라인 헤더 */}
                    <TimelineHeaderRow
                        dates={dates}
                        dayColumnWidth={dayColumnWidth}
                    />

                    {/* 타임라인 그리드 */}
                    <TimelineGrid
                        dates={dates}
                        dayColumnWidth={dayColumnWidth}
                        rowCount={4}
                    />
                </div>
            </div>
        </div>
    );
}

import { useRef, useState, useEffect, useCallback } from "react";
// import { useResponsiveLayout } from "@/hooks/design/use-responsive-layout";
import {
    useTimelineContainer,
    useTimelineScroll,
    useTimelineDays
} from "@/hooks/timeline";
import { TimelineControls } from "./TimelineControls";
import { TimelineHeaderRow } from "./TimelineHeaderRow";
import { TimelineGrid } from "./TimelineGrid";

export function Timeline() {
    // const { width } = useResponsiveLayout();
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    const [currentDate, setCurrentDate] = useState(() => new Date());

    const { days, dates, monthName, year } = useTimelineDays({
        year: currentDate.getFullYear(),
        month: currentDate.getMonth()
    });

    const { dayColumnWidth } = useTimelineContainer({
        scrollContainerRef,
        targetDaysToShow: 14
    });

    const { scrollLeft, scrollRight } = useTimelineScroll({
        scrollContainerRef,
        dayColumnWidth
    });

    const minContainerWidth = days.length * dayColumnWidth;

    const goToPreviousMonth = useCallback(() => {
        setCurrentDate((prevDate) => {
            const newDate = new Date(prevDate);
            newDate.setMonth(prevDate.getMonth() - 1);
            return newDate;
        });
    }, []);

    const goToNextMonth = useCallback(() => {
        setCurrentDate((prevDate) => {
            const newDate = new Date(prevDate);
            newDate.setMonth(prevDate.getMonth() + 1);
            return newDate;
        });
    }, []);

    useEffect(() => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollLeft = 0;
        }
    }, [currentDate.getMonth(), currentDate.getFullYear()]);

    return (
        <div className="min-h-screen">
            <div className="flex justify-between items-center mb-4">
                <TimelineControls
                    scrollLeft={scrollLeft}
                    scrollRight={scrollRight}
                    currentDate={currentDate}
                />

                <div className="flex items-center gap-2">
                    <button
                        onClick={goToPreviousMonth}
                        className="bg-white hover:bg-gray-100 px-3 py-1 border rounded-md text-sm"
                    >
                        Previous Month
                    </button>
                    <button
                        onClick={goToNextMonth}
                        className="bg-white hover:bg-gray-100 px-3 py-1 border rounded-md text-sm"
                    >
                        Next Month
                    </button>
                </div>
            </div>

            <div
                ref={scrollContainerRef}
                className="overflow-x-auto scrollbar-hide"
                style={{
                    WebkitOverflowScrolling: "touch",
                    scrollSnapType: "x mandatory"
                }}
            >
                <div style={{ minWidth: `${minContainerWidth}px` }}>
                    <TimelineHeaderRow
                        dates={dates}
                        dayColumnWidth={dayColumnWidth}
                    />

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

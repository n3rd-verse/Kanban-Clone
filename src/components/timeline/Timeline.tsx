import { useRef, useState, useEffect, useCallback } from "react";
import {
    useTimelineContainer,
    useTimelineScroll,
    useTimelineDays
} from "@/hooks/timeline";
import { TimelineControls } from "./TimelineControls";
import { TimelineHeaderRow } from "./TimelineHeaderRow";
import { TimelineGrid } from "./TimelineGrid";
import { useTranslation } from "react-i18next";

export function Timeline() {
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const [scrollLeft, setScrollLeft] = useState(0);
    const { t } = useTranslation();

    const [currentDate, setCurrentDate] = useState(() => new Date());

    const { days, dates, monthName, year } = useTimelineDays({
        year: currentDate.getFullYear(),
        month: currentDate.getMonth()
    });

    const { dayColumnWidth } = useTimelineContainer({
        scrollContainerRef,
        targetDaysToShow: 14
    });

    const { scrollLeft: scrollLeftFn, scrollRight } = useTimelineScroll({
        scrollContainerRef,
        dayColumnWidth
    });

    const minContainerWidth = days.length * dayColumnWidth;

    const handleMouseDown = useCallback((e: React.MouseEvent) => {
        if (!scrollContainerRef.current) return;

        setIsDragging(true);
        setStartX(e.pageX);
        setScrollLeft(scrollContainerRef.current.scrollLeft);
    }, []);

    const handleMouseMove = useCallback(
        (e: React.MouseEvent) => {
            if (!isDragging || !scrollContainerRef.current) return;

            e.preventDefault();
            const x = e.pageX;
            const distance = x - startX;
            scrollContainerRef.current.scrollLeft = scrollLeft - distance;
        },
        [isDragging, startX, scrollLeft]
    );

    const handleMouseUpOrLeave = useCallback(() => {
        setIsDragging(false);
    }, []);

    useEffect(() => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollLeft = 0;
        }
    }, [currentDate.getMonth(), currentDate.getFullYear()]);

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

    return (
        <div className="min-h-screen">
            <div className="flex justify-between items-center mb-4">
                <TimelineControls
                    scrollLeft={scrollLeftFn}
                    scrollRight={scrollRight}
                    currentDate={currentDate}
                />

                <div className="flex items-center gap-2">
                    <button
                        onClick={goToPreviousMonth}
                        className="bg-white hover:bg-gray-100 px-3 py-1 border rounded-md text-sm"
                    >
                        {t("timeline.previousMonth")}
                    </button>
                    <button
                        onClick={goToNextMonth}
                        className="bg-white hover:bg-gray-100 px-3 py-1 border rounded-md text-sm"
                    >
                        {t("timeline.nextMonth")}
                    </button>
                </div>
            </div>

            <div
                ref={scrollContainerRef}
                className="overflow-x-auto select-none scrollbar-hide"
                style={{
                    cursor: isDragging ? "grabbing" : "grab",
                    userSelect: "none",
                    WebkitUserSelect: "none",
                    MozUserSelect: "none",
                    msUserSelect: "none"
                }}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUpOrLeave}
                onMouseLeave={handleMouseUpOrLeave}
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

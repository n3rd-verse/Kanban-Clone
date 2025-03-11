import { TimelineHeader } from "./TimelineHeader";
import { memo, useMemo } from "react";

interface TimelineHeaderRowProps {
    dates: Date[];
    dayColumnWidth: number;
}

function TimelineHeaderRowComponent({
    dates,
    dayColumnWidth
}: TimelineHeaderRowProps) {
    const headers = useMemo(() => {
        return dates.map((date) => (
            <TimelineHeader
                key={date.toISOString()}
                date={date}
                width={dayColumnWidth}
            />
        ));
    }, [dates, dayColumnWidth]);

    return (
        <div className="relative">
            <div className="top-[50%] right-0 left-0 absolute h-[2px]">
                <div className="relative w-full">
                    <div className="absolute inset-0 bg-red-500" />
                </div>
            </div>
            <div className="flex">{headers}</div>
        </div>
    );
}

export const TimelineHeaderRow = memo(TimelineHeaderRowComponent);

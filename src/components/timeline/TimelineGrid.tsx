import { isWeekend } from "date-fns";
import { cn } from "@/lib/utils";
import { memo, useMemo } from "react";

interface TimelineGridProps {
    dates: Date[];
    dayColumnWidth: number;
    rowCount?: number;
}

function TimelineGridComponent({
    dates,
    dayColumnWidth,
    rowCount = 4
}: TimelineGridProps) {
    const rows = useMemo(() => {
        return Array.from({ length: rowCount }, (_, i) => i + 1);
    }, [rowCount]);

    const renderDateCell = useMemo(() => {
        return dates.map((date) => {
            const isWeekendDay = isWeekend(date);

            return (
                <div
                    key={date.toISOString()}
                    style={{
                        width: `${dayColumnWidth}px`,
                        minWidth: `${dayColumnWidth}px`,
                        scrollSnapAlign: "start",
                        height: "100%"
                    }}
                    className={cn("h-full", isWeekendDay && "bg-[#F7F7F7]")}
                />
            );
        });
    }, [dates, dayColumnWidth]);

    const gridRows = useMemo(() => {
        return rows.map((row) => (
            <div key={row} className="flex flex-1">
                {renderDateCell}
            </div>
        ));
    }, [rows, renderDateCell]);

    return (
        <div className="flex flex-col h-[calc(100vh-130px)]">{gridRows}</div>
    );
}

export const TimelineGrid = memo(TimelineGridComponent);

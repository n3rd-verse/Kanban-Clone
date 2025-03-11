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
                        scrollSnapAlign: "start"
                    }}
                    className={cn("h-[150px]", isWeekendDay && "bg-[#F7F7F7]")}
                />
            );
        });
    }, [dates, dayColumnWidth]);

    const gridRows = useMemo(() => {
        return rows.map((row) => (
            <div key={row} className="flex">
                {renderDateCell}
            </div>
        ));
    }, [rows, renderDateCell]);

    return <div className="flex flex-col gap-0">{gridRows}</div>;
}

export const TimelineGrid = memo(TimelineGridComponent);

import { format, isToday, isWeekend } from "date-fns";
import { cn } from "@/lib/utils";
import { memo, useMemo } from "react";

interface TimelineHeaderProps {
    date: Date;
    width?: number;
}

function TimelineHeaderComponent({ date, width }: TimelineHeaderProps) {
    const dateInfo = useMemo(() => {
        const isCurrentDay = isToday(date);
        const isWeekendDay = isWeekend(date);
        const fullDayOfWeek = format(date, "EEEE");
        const dayOfWeek = fullDayOfWeek[0];
        const isSunday = fullDayOfWeek === "Sunday";
        const isSaturday = fullDayOfWeek === "Saturday";
        const dayNumber = format(date, "d");

        return {
            isCurrentDay,
            isWeekendDay,
            dayOfWeek,
            isSunday,
            isSaturday,
            dayNumber
        };
    }, [date]);

    const dayOfWeekClass = useMemo(() => {
        return cn(
            "text-sm mb-1 font-bold",
            dateInfo.isSunday && "text-red-500",
            dateInfo.isSaturday && "text-blue-500",
            !dateInfo.isWeekendDay && "text-gray-500"
        );
    }, [dateInfo]);

    const dayNumberClass = useMemo(() => {
        return cn(
            "text-base font-bold",
            dateInfo.isSunday && "text-red-500",
            dateInfo.isSaturday && "text-blue-500"
        );
    }, [dateInfo]);

    return (
        <div
            className="relative text-center"
            style={{
                width: width ? `${width}px` : undefined,
                minWidth: width ? `${width}px` : undefined,
                scrollSnapAlign: "start"
            }}
        >
            <div className="flex flex-col items-center py-2">
                <span className={dayOfWeekClass}>{dateInfo.dayOfWeek}</span>
                <span className={dayNumberClass}>{dateInfo.dayNumber}</span>
            </div>
        </div>
    );
}

export const TimelineHeader = memo(TimelineHeaderComponent);

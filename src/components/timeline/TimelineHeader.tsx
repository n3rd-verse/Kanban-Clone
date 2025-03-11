import { format, isToday, isWeekend } from "date-fns";
import { cn } from "@/lib/utils";

interface TimelineHeaderProps {
    date: Date;
    width?: number;
}

export function TimelineHeader({ date, width }: TimelineHeaderProps) {
    const isCurrentDay = isToday(date);
    const isWeekendDay = isWeekend(date);
    const fullDayOfWeek = format(date, "EEEE"); // "Sunday", "Monday" etc.
    const dayOfWeek = fullDayOfWeek[0]; // "S", "M" etc.
    const isSunday = fullDayOfWeek === "Sunday";
    const isSaturday = fullDayOfWeek === "Saturday";

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
                <span
                    className={cn(
                        "text-sm mb-1 font-bold",
                        isSunday && "text-red-500",
                        isSaturday && "text-blue-500",
                        !isWeekendDay && "text-gray-500"
                    )}
                >
                    {dayOfWeek}
                </span>
                <span
                    className={cn(
                        "text-base font-bold",
                        isSunday && "text-red-500",
                        isSaturday && "text-blue-500"
                    )}
                >
                    {format(date, "d")}
                </span>
            </div>
        </div>
    );
}

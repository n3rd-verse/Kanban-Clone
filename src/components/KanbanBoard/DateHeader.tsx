import { memo } from "react";
import { format, isToday, isYesterday } from "date-fns";
import { cn } from "@/lib/utils";

interface DateHeaderProps {
    date: Date;
    type: "past" | "future";
}

export const DateHeader = memo(function DateHeader({
    date,
    type
}: DateHeaderProps) {
    const day = format(date, "d");
    const weekday = format(date, "EEE").toUpperCase();
    const month = format(date, "MMM");
    const year = format(date, "yyyy");
    const opacity = type === "past" ? "opacity-50" : "";

    let specialLabel = "";
    const isCurrentDay = isToday(date);
    const isPreviousDay = isYesterday(date);

    if (isCurrentDay) {
        specialLabel = "Today";
    } else if (isPreviousDay) {
        specialLabel = "Yesterday";
    }

    return (
        <div className={cn("flex items-center mb-1.5", opacity)}>
            <div className="flex items-center gap-4">
                <span
                    className={cn(
                        "font-medium text-2xl",
                        isCurrentDay ? "text-blue-500" : ""
                    )}
                >
                    {day}
                </span>
                <div className="flex flex-col">
                    {specialLabel ? (
                        <span className="text-gray-500">
                            {weekday} · {specialLabel}
                        </span>
                    ) : (
                        <span className="text-gray-500">
                            {weekday} · {month} · {year}
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
});

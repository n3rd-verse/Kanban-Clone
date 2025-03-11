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

    let suffix = "";
    let suffixColor = "";
    if (isToday(date)) {
        suffix = "· today";
        suffixColor = "text-blue-500";
    } else if (isYesterday(date)) {
        suffix = "· yesterday";
    }

    return (
        <div className={cn("flex items-center mb-1.5", opacity)}>
            <div className="flex items-center gap-4">
                <span className="font-medium text-2xl">{day}</span>
                <div className="flex flex-col">
                    <span className="text-gray-500">
                        {weekday} · {month} · {year}
                    </span>
                    {suffix && (
                        <span
                            className={cn("text-gray-500 text-sm", suffixColor)}
                        >
                            {suffix}
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
});

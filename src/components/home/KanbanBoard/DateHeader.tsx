import { memo } from "react";
import { format, isToday, isYesterday } from "date-fns";
import { Calendar } from "lucide-react";

interface DateHeaderProps {
    date: Date;
}

export const DateHeader = memo(function DateHeader({ date }: DateHeaderProps) {
    const day = format(date, "d");
    const weekday = format(date, "EEE").toUpperCase();
    const month = format(date, "MMM");
    const year = format(date, "yyyy");

    let suffix = "";
    if (isToday(date)) {
        suffix = "· today";
    } else if (isYesterday(date)) {
        suffix = "· yesterday";
    }

    return (
        <div className="flex items-center mb-6">
            <div className="flex items-center gap-4">
                <span className="font-medium text-3xl">{day}</span>
                <div className="flex flex-col">
                    <span className="text-gray-500">
                        {weekday} · {month} · {year}
                    </span>
                    {suffix && (
                        <span className="text-gray-500 text-sm">{suffix}</span>
                    )}
                </div>
            </div>
        </div>
    );
});

import { memo } from 'react';
import { format, isToday, isYesterday } from "date-fns";
import { Calendar } from "lucide-react";

interface DateHeaderProps {
    date: Date;
}

export const DateHeader = memo(function DateHeader({ date }: DateHeaderProps) {
    const day = format(date, "d");
    const weekday = format(date, "EEE");
    const month = format(date, "MMM");
    const year = format(date, "yyyy");

    let suffix = "";
    if (isToday(date)) {
        suffix = "· Today";
    } else if (isYesterday(date)) {
        suffix = "· Yesterday";
    }

    return (
        <div className="flex items-center gap-2 mb-6">
            <Calendar size={20} className="text-gray-600" />
            <h2 className="font-semibold text-xl">
                {day}
                <span className="ml-2 font-normal text-gray-500">
                    {weekday} · {month} · {year} {suffix}
                </span>
            </h2>
        </div>
    );
});
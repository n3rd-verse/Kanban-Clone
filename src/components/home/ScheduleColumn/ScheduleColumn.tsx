import { format, isToday, isYesterday } from "date-fns";
import { Calendar, Clock } from "lucide-react";
import { Card } from "@/components/ui/card";
import type { Schedule } from "@/types/schedule";
import { mockScheduleDays } from "@/mocks/mockData";

interface ScheduleCardProps {
    schedule: Schedule;
}

function ScheduleCard({ schedule }: ScheduleCardProps) {
    const isDaily = schedule.type === "daily";
    const borderColor = isDaily ? "border-blue-500" : "border-red-500";

    return (
        <Card className={`p-4 border-l-4 ${borderColor} mb-3`}>
            <div className="flex items-center gap-2 mb-2 text-gray-600 text-sm">
                <Clock size={14} />
                <span>
                    {schedule.startTime} → {schedule.endTime}
                </span>
            </div>
            <h3 className="mb-2 font-medium">{schedule.title}</h3>
            {schedule.location && (
                <div className="mb-2 text-gray-500 text-sm">
                    {schedule.location}
                </div>
            )}
        </Card>
    );
}

function DateHeader({ date }: { date: Date }) {
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
}

export function ScheduleColumn() {
    return (
        <div className="pl-6 border-gray-200 border-l min-h-screen">
            {mockScheduleDays.map((dayInfo) => (
                <div key={dayInfo.id} className="mb-8">
                    <DateHeader date={dayInfo.date} />
                    <div className="space-y-6">
                        {dayInfo.schedules.map((schedule) => (
                            <ScheduleCard
                                key={schedule.id}
                                schedule={schedule}
                            />
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
}

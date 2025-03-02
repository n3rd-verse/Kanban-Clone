import { memo } from "react";
import { Clock } from "lucide-react";
import { Card } from "@/components/ui/card";
import type { Schedule } from "@/types/schedule";
import { cn } from "@/lib/utils";

interface ScheduleCardProps {
    schedule: Schedule;
}

export const ScheduleCard = memo(function ScheduleCard({
    schedule
}: ScheduleCardProps) {
    const isDaily = schedule.type === "daily";
    const borderColor = isDaily ? "border-blue-500" : "border-red-500";

    // const handleClick = () => {
    //     console.log("Schedule clicked:", schedule);
    // };

    return (
        <Card
            className={cn(
                `p-4 border-l-4 ${borderColor} mb-3`,
                "cursor-pointer",
                "hover:shadow-md transition-shadow"
            )}
            // onClick={handleClick}
        >
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
});

import { memo, useState } from "react";
import { Clock } from "lucide-react";
import { Card } from "@/components/ui/card";
import type { Schedule } from "@/types/schedule";
import { cn } from "@/lib/utils";
import { useOpenScheduleMutation } from "@/hooks/api/schedules/use-open-schedule-mutation";
import React from "react";

interface ScheduleCardProps {
    schedule: Schedule;
}

export const ScheduleCard = memo(function ScheduleCard({
    schedule
}: ScheduleCardProps) {
    const isPast = schedule.type === "past";
    const borderColor = isPast ? "" : "border-blue-200";
    const opacity = isPast ? "opacity-50" : "";
    const showDay = schedule.startTime != null || schedule.endTime != null;
    const { mutate: openSchedule } = useOpenScheduleMutation();
    const [startPos, setStartPos] = useState({ x: 0, y: 0 });
    
    // const handleClick = () => {
    //     console.log("Schedule clicked:", schedule);
    // };

    const handleMouseDown = (e: React.MouseEvent) => {
        setStartPos({ x: e.clientX, y: e.clientY });
    };

    const handleClick = (e: React.MouseEvent) => {
        const diffX = Math.abs(e.clientX - startPos.x);
        const diffY = Math.abs(e.clientY - startPos.y);
        const threshold = 5;
        
        if (diffX > threshold || diffY > threshold) {
          return;
        }
        
        openSchedule(schedule.id)
    };


    return (
        <Card
            className={cn(
                "p-4 hover:shadow-md transition-shadow",
                `break-words h-full ${borderColor}`,
                "group relative",
                opacity,
                "cursor-pointer",
            )}
            onClick={(e) => {
                handleClick(e);
            }}
            onMouseDown={handleMouseDown}
        >
            {showDay && (
                <div className="flex items-center gap-2 mb-1 text-gray-600 text-sm">
                <Clock size={14} />
                <span>
                    {schedule.startTime} → {schedule.endTime}
                </span>
            </div>
            )}
            
            <h3 className="mb-2 font-medium">{schedule.title}</h3>
            <div className="flex items-center gap-2 mb-1 overflow-hidden">
                <div className="flex flex-shrink-0 items-center gap-1 min-w-0">
                    {schedule.attendees.map((assignee, index) => (
                        <React.Fragment key={assignee}>
                            <span className="text-[#3362FF] text-sm truncate">
                                {assignee}
                            </span>
                            {index < schedule.attendees.length - 1 && (
                                <span className="text-[#3362FF] text-sm">
                                    ,
                                </span>
                            )}
                        </React.Fragment>
                    ))}
                </div>
            </div>

            {schedule.location && (
                <div className="mb-2 text-gray-500 text-sm">
                    {schedule.location}
                </div>
            )}
        </Card>
    );
});

import { memo, useState } from "react";
import { Clock } from "lucide-react";
import { Card } from "@/components/ui/card";
import type { Schedule } from "@/types/schedule";
import { cn } from "@/lib/utils";
import { useOpenScheduleMutation } from "@/hooks/api/schedules/use-open-schedule-mutation";
import React from "react";
import { useOpenContactMutation } from "@/hooks/api/contacts/use-open-contact-mutation";
import { ContactAddress } from "./ContactAddress";

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
    const { mutate: openContact } = useOpenContactMutation();
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

        openSchedule(schedule.id);
    };

    return (
        <Card
            className={cn(
                "hover:shadow-md transition-shadow",
                `break-words ${borderColor}`,
                "group relative",
                opacity,
                "cursor-pointer",
                !schedule.attendees.length && !schedule.location
                    ? "h-[73px] py-3 px-4"
                    : "p-4"
            )}
            onClick={(e) => {
                handleClick(e);
            }}
            onMouseDown={handleMouseDown}
        >
            {showDay && (
                <div className="flex items-center gap-2 mb-1 text-gray-600 text-sm">
                    {/* <Clock size={14} /> */}
                    <span>
                        {schedule.startTime} → {schedule.endTime}
                    </span>
                </div>
            )}

            <h3
                className={cn(
                    "font-medium",
                    !schedule.attendees.length && !schedule.location
                        ? "mb-0"
                        : "mb-2"
                )}
            >
                {schedule.title}
            </h3>
            <div className="flex items-center gap-2 mb-1 overflow-hidden">
                <div className="flex flex-shrink-0 items-center gap-1 min-w-0">
                {schedule.attendees.map((address, index) => (
                    <ContactAddress 
                        key={address.email}
                        address={address}
                        showSeparator={index < schedule.attendees.length - 1}
                    />
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

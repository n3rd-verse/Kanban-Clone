import { useState } from "react";
import { Card } from "@/components/ui/card";
import type { Schedule } from "@/types/schedule";
import { cn } from "@/lib/utils";
import { useOpenScheduleMutation } from "@/hooks/api/schedules/use-open-schedule-mutation";
import { useDeleteScheduleMutation } from "@/hooks/api/schedules/use-delete-schedule-mutation";
import { useTranslation } from "react-i18next";
import React, { useCallback } from "react";
import { CardDeleteButton, ContactAddress } from "../common";

interface ScheduleCardProps {
    schedule: Schedule;
}

export function ScheduleCard({ schedule }: ScheduleCardProps) {
    const isPast = schedule.type === "past";
    const borderColor = isPast ? "" : "border-blue-200";
    const opacity = isPast ? "opacity-50" : "";
    const showDay = schedule.startTime != null || schedule.endTime != null;
    const { mutate: openSchedule } = useOpenScheduleMutation();
    const { mutate: deleteSchedule, isPending: isDeleting } = useDeleteScheduleMutation();
    const { t } = useTranslation();
    const [startPos, setStartPos] = useState({ x: 0, y: 0 });

    // const handleClick = () => {
    //     console.log("Schedule clicked:", schedule);
    // };

    const handleDelete = useCallback(() => {
        if (window.confirm(t("event.deleteConfirmation"))) {
            deleteSchedule(schedule.id);
        }
    }, [deleteSchedule, schedule.id, t]);

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
            onClick={handleClick}
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

            <div className="flex items-center justify-between">
                <h3 className={cn(
                    "font-medium",
                    !schedule.attendees.length && !schedule.location
                        ? "mb-0"
                        : "mb-2"
                )}>{schedule.title}</h3>
                <div className="flex items-center gap-2 ml-2 shrink-0">
                    <div className="flex items-center">
                        <CardDeleteButton onClick={handleDelete} disabled={isDeleting} />
                    </div>
                </div>
            </div>

            <div className="flex items-center gap-2 mb-1 overflow-hidden">
                <div className="flex flex-shrink-0 items-center gap-1 min-w-0">
                    {schedule.attendees.map((address, index) => (
                        <ContactAddress
                            key={address.email}
                            address={address}
                            showSeparator={
                                index < schedule.attendees.length - 1
                            }
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
}

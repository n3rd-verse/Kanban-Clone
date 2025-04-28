import { Card } from "@/components/ui/card";
import type { Schedule } from "@/types/schedule";
import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";
import React, { memo, useRef } from "react";
import { CardDeleteButton, ContactAddress } from "../common";
import { useScheduleCard } from "@/hooks/kanban/useScheduleCard";
import {
    Popover,
    PopoverContent,
    PopoverTrigger
} from "@/components/ui/popover";
import { LoadingSpinner } from "@/components/LoadingSpinner";

interface ScheduleCardProps {
    schedule: Schedule;
}

export const ScheduleCard = memo(function ScheduleCard({
    schedule
}: ScheduleCardProps) {
    const { t } = useTranslation();
    const { state, handlers } = useScheduleCard(schedule);
    const popoverRef = useRef<HTMLDivElement>(null);

    const { showAiSummary, isLoading, contentInfo, hasAiContent } = state;

    const {
        handleDelete,
        handleClick,
        handleMouseDown,
        handleCardMouseEnter,
        handleCardMouseLeave,
        handlePopoverOpenChange,
        handlePopoverMouseEnter,
        handlePopoverMouseLeave
    } = handlers;

    const { hasAttendees, hasLocation, hasTimeInfo, isPast } = contentInfo;
    const borderColor = isPast ? "" : "border-blue-200";
    const opacity = isPast ? "opacity-50" : "";

    return (
        <Popover open={showAiSummary} onOpenChange={handlePopoverOpenChange}>
            <PopoverTrigger asChild>
                <Card
                    className={cn(
                        "hover:shadow-md",
                        `break-words ${borderColor}`,
                        "group relative",
                        opacity,
                        "cursor-pointer",
                        !hasAttendees && !hasLocation
                            ? "h-[73px] py-3 px-4"
                            : "p-4"
                    )}
                    onClick={handleClick}
                    onMouseDown={handleMouseDown}
                    onMouseEnter={handleCardMouseEnter}
                    onMouseLeave={handleCardMouseLeave}
                >
                    {isLoading && <LoadingSpinner overlay />}

                    {hasTimeInfo && (
                        <div className="flex items-center gap-2 mb-1 text-gray-600 text-sm">
                            <span>
                                {schedule.startTime} → {schedule.endTime}
                            </span>
                        </div>
                    )}

                    <div className="flex justify-between items-center">
                        <h3
                            className={cn(
                                "font-medium",
                                !hasAttendees && !hasLocation ? "mb-0" : "mb-2"
                            )}
                        >
                            {schedule.title}
                        </h3>
                        <div className="flex items-center gap-2 ml-2 shrink-0">
                            <div className="flex items-center">
                                <CardDeleteButton
                                    onClick={handleDelete}
                                    disabled={isLoading}
                                />
                            </div>
                        </div>
                    </div>

                    {hasAttendees && (
                        <div className="flex items-center gap-2 mb-1 overflow-hidden">
                            <div className="flex flex-shrink-0 items-center gap-1 min-w-0">
                                {schedule.attendees.map((address, index) => (
                                    <ContactAddress
                                        key={`${address.email || address.name}-${index}`}
                                        address={address}
                                        showSeparator={
                                            index <
                                            schedule.attendees.length - 1
                                        }
                                    />
                                ))}
                            </div>
                        </div>
                    )}

                    {hasLocation && (
                        <div className="mb-2 text-gray-500 text-sm">
                            {schedule.location}
                        </div>
                    )}
                </Card>
            </PopoverTrigger>

            {hasAiContent && (
                <PopoverContent
                    ref={popoverRef}
                    className="p-3 w-72"
                    side="top"
                    align="center"
                    sideOffset={5}
                    avoidCollisions
                    collisionPadding={10}
                    onMouseEnter={handlePopoverMouseEnter}
                    onMouseLeave={handlePopoverMouseLeave}
                >
                    <div className="space-y-3 max-h-[300px] overflow-y-auto text-sm custom-scrollbar">
                        {schedule.ai?.summary && (
                            <div className="text-gray-700 break-words">
                                {schedule.ai.summary}
                            </div>
                        )}

                        {schedule.ai?.popupInfo && (
                            <div className="space-y-2 pt-2 border-gray-200 border-t">
                                {Object.entries(schedule.ai.popupInfo).map(
                                    ([key, value], index) => (
                                        <div
                                            key={index}
                                            className="flex flex-col gap-1 text-sm"
                                        >
                                            <div className="text-gray-700 break-words">
                                                <span className="font-medium">
                                                    {key}:
                                                </span>{" "}
                                                <span className="break-words">
                                                    {typeof value === "object"
                                                        ? JSON.stringify(value)
                                                        : String(value)}
                                                </span>
                                            </div>
                                        </div>
                                    )
                                )}
                            </div>
                        )}
                    </div>
                </PopoverContent>
            )}
        </Popover>
    );
});

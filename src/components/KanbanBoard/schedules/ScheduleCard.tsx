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

// 참석자 렌더링 컴포넌트
const ScheduleAttendees = memo(function ScheduleAttendees({
    attendees
}: {
    attendees: Schedule["attendees"];
}) {
    if (!attendees || attendees.length === 0) return null;
    return (
        <div className="flex items-center gap-2 mb-1 overflow-hidden">
            <div className="flex flex-shrink-0 items-center gap-1 min-w-0">
                {attendees.map((address, index) => (
                    <ContactAddress
                        key={`${address.email || address.name}-${index}`}
                        address={address}
                        showSeparator={index < attendees.length - 1}
                    />
                ))}
            </div>
        </div>
    );
});

// 시간 정보 렌더링 컴포넌트
const ScheduleTime = memo(function ScheduleTime({
    startTime,
    endTime
}: {
    startTime: string;
    endTime: string;
}) {
    if (!startTime && !endTime) return null;
    return (
        <div className="flex items-center gap-2 mb-1 text-gray-600 text-sm">
            <span>
                {startTime} → {endTime}
            </span>
        </div>
    );
});

// 장소 정보 렌더링 컴포넌트
const ScheduleLocation = memo(function ScheduleLocation({
    location
}: {
    location?: string;
}) {
    if (!location) return null;
    return <div className="mb-2 text-gray-500 text-sm">{location}</div>;
});

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

    // TaskCard와 동일한 패턴: needsMinHeight 변수로 분리
    const needsMinHeight = !hasAttendees && !hasLocation && !hasTimeInfo;

    return (
        <Popover open={showAiSummary} onOpenChange={handlePopoverOpenChange}>
            <PopoverTrigger asChild>
                <Card
                    className={cn(
                        "p-4",
                        "break-words h-full",
                        `group relative ${borderColor}`,
                        opacity,
                        "cursor-pointer"
                    )}
                    onClick={handleClick}
                    onMouseDown={handleMouseDown}
                    onMouseEnter={handleCardMouseEnter}
                    onMouseLeave={handleCardMouseLeave}
                >
                    {isLoading && <LoadingSpinner overlay />}
                    <div className="flex flex-col h-full">
                        <div
                            className={cn(
                                "flex-1 min-w-0 max-w-full",
                                needsMinHeight && "min-h-16"
                            )}
                        >
                            <ScheduleTime
                                startTime={schedule.startTime}
                                endTime={schedule.endTime}
                            />
                            <div className="flex justify-between items-start">
                                <h3
                                    className={cn(
                                        "flex-1 font-medium break-words min-w-0 mb-0"
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
                            <ScheduleAttendees attendees={schedule.attendees} />
                            <ScheduleLocation location={schedule.location} />
                        </div>
                    </div>
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

import type { Task } from "@/types/task";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { format } from "date-fns";
import { CardDeleteButton } from "../common";
import React, { useState, useCallback, memo } from "react";
import { cn } from "@/lib/utils";
import { ContactAddress } from "../common";
import { TaskStatus } from "@/constants/task-status";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { useTaskCard } from "@/hooks/kanban/useTaskCard";

import {
    Popover,
    PopoverContent,
    PopoverTrigger
} from "@/components/ui/popover";
import { AI_INFO_FIELD, AiInfoValue } from "@/constants/ai-info-fields";

interface TaskCardProps {
    task: Task;
    className?: string;
}

interface TaskHeaderProps {
    title: string;
    onDelete: () => void;
    onComplete: () => void;
    isCompleted: boolean;
    allowEdit: boolean;
    isLoading: boolean;
}

interface TaskHeaderActionsProps {
    onDelete: () => void;
    onComplete: () => void;
    isCompleted: boolean;
    allowEdit: boolean;
    isLoading: boolean;
}

export function TaskCard({ task, className }: TaskCardProps) {
    const { state, handlers } = useTaskCard(task);
    const { showAiSummary, isLoading, contentInfo } = state;
    const {
        handleDelete,
        handleComplete,
        handleClick,
        handleCardMouseEnter,
        handleCardMouseLeave,
        handlePopoverOpenChange
    } = handlers;

    const { hasAssignees, hasDate, hasMiddleRowContent, isCompleted } =
        contentInfo;

    const hasAiContent =
        !!task.ai?.summary ||
        (!!task.ai?.popupInfo &&
            Array.isArray(task.ai.popupInfo) &&
            task.ai.popupInfo.length > 0);

    return (
        <Popover open={showAiSummary} onOpenChange={handlePopoverOpenChange}>
            <PopoverTrigger asChild>
                <Card
                    className={cn(
                        "p-4 hover:shadow-md transition-shadow",
                        "break-words h-full",
                        "group relative",
                        "cursor-pointer overflow-hidden",
                        isLoading && "opacity-50",
                        className
                    )}
                    onClick={handleClick}
                    onMouseEnter={handleCardMouseEnter}
                    onMouseLeave={handleCardMouseLeave}
                >
                    {isLoading && <LoadingSpinner overlay />}
                    <div className="flex flex-col h-full">
                        <div className="flex-1 min-w-0 max-w-full">
                            <TaskHeader
                                title={task.title}
                                onDelete={handleDelete}
                                onComplete={handleComplete}
                                isCompleted={isCompleted}
                                allowEdit={!!task.allowEdit}
                                isLoading={isLoading}
                            />

                            {hasMiddleRowContent && (
                                <MiddleContentRow
                                    hasAssignees={hasAssignees}
                                    hasDate={!!hasDate}
                                    taskAssignees={task.assignee}
                                    taskDate={task.date}
                                    taskStatus={task.status}
                                />
                            )}

                            {hasAssignees && hasDate && (
                                <TaskDate
                                    date={task.date}
                                    status={task.status}
                                />
                            )}
                        </div>
                    </div>
                </Card>
            </PopoverTrigger>
            {hasAiContent && (
                <PopoverContent
                    className="p-3 w-72"
                    side="top"
                    align="center"
                    sideOffset={5}
                    avoidCollisions
                    collisionPadding={10}
                >
                    <div className="space-y-3 text-sm">
                        {task.ai?.summary && (
                            <div className="text-gray-700 break-words">
                                {task.ai.summary}
                            </div>
                        )}

                        {task.ai?.popupInfo &&
                            Array.isArray(task.ai.popupInfo) &&
                            task.ai.popupInfo.length > 0 && (
                                <div className="space-y-2 pt-2 border-gray-200 border-t">
                                    {task.ai.popupInfo.map((item, index) => (
                                        <InfoItem key={index} item={item} />
                                    ))}
                                </div>
                            )}
                    </div>
                </PopoverContent>
            )}
        </Popover>
    );
}

interface MiddleContentRowProps {
    hasAssignees: boolean;
    hasDate: boolean;
    taskAssignees: Task["assignee"];
    taskDate: Task["date"];
    taskStatus: TaskStatus;
}

const MiddleContentRow = memo(function MiddleContentRow({
    hasAssignees,
    hasDate,
    taskAssignees,
    taskDate,
    taskStatus
}: MiddleContentRowProps) {
    return (
        <div className="flex justify-between items-center mt-1">
            <div className="flex-1 min-w-0 overflow-hidden">
                {hasAssignees ? (
                    <TaskAssignees assignees={taskAssignees} />
                ) : (
                    hasDate && <TaskDate date={taskDate} status={taskStatus} />
                )}
            </div>
        </div>
    );
});

const TaskHeader = memo(function TaskHeader({
    title,
    onDelete,
    onComplete,
    isCompleted,
    allowEdit,
    isLoading
}: TaskHeaderProps) {
    return (
        <div className="flex justify-between items-start">
            <h3 className="mb-1 font-medium break-words">{title}</h3>

            <TaskHeaderActions
                onDelete={onDelete}
                onComplete={onComplete}
                isCompleted={isCompleted}
                allowEdit={allowEdit}
                isLoading={isLoading}
            />
        </div>
    );
});

const TaskHeaderActions = memo(function TaskHeaderActions({
    onDelete,
    onComplete,
    isCompleted,
    allowEdit,
    isLoading
}: TaskHeaderActionsProps) {
    return (
        <div className="flex items-center gap-2 ml-2 shrink-0">
            <div className="flex items-center">
                <CardDeleteButton onClick={onDelete} disabled={isLoading} />
            </div>
            <div
                className="flex items-center"
                onClick={(e) => e.stopPropagation()}
            >
                <Checkbox
                    checked={isCompleted}
                    onCheckedChange={onComplete}
                    className="w-5 h-5"
                    disabled={!!allowEdit || isLoading}
                />
            </div>
        </div>
    );
});

function TaskAssignees({ assignees }: { assignees: Task["assignee"] }) {
    return (
        <div className="flex items-center gap-2 mt-1 overflow-hidden">
            <div className="flex flex-shrink-0 items-center gap-1 min-w-0 max-w-[calc(100%-30px)] overflow-hidden">
                {assignees.map((assignee, index) => (
                    <ContactAddress
                        key={assignee.email}
                        address={assignee}
                        showSeparator={index < assignees.length - 1}
                    />
                ))}
            </div>
        </div>
    );
}

function TaskDate({
    date,
    status
}: {
    date: string | null | undefined;
    status: TaskStatus;
}) {
    if (!date || status === TaskStatus.COMPLETED) return null;

    const dateColorClass =
        status === TaskStatus.URGENT ? "text-[#ea384c]" : "text-gray-400";

    return (
        <div className={`text-sm ${dateColorClass} pt-2`}>
            {format(new Date(date), "MMM dd, yyyy")}
        </div>
    );
}

// Extracted the info item for better readability
interface InfoItemProps {
    item: Record<string, AiInfoValue>;
}

const InfoItem = memo(function InfoItem({ item }: InfoItemProps) {
    const key = Object.keys(item)[0];
    const value = item[key];

    return (
        <div className="flex flex-col gap-1 text-sm">
            <div className="text-gray-700 break-words">
                <span className="font-medium">{key}:</span>{" "}
                <span className="break-words">
                    {renderPopupInfoValue(value)}
                </span>
            </div>
        </div>
    );
});

const renderPopupInfoValue = (value: AiInfoValue): string => {
    if (typeof value === "string") {
        return value;
    }

    if (typeof value === "object" && value !== null) {
        const { START_TIME, END_TIME } = AI_INFO_FIELD.TIME_RANGE;
        const { DATE, TIME } = AI_INFO_FIELD.DATETIME;
        const { NAME, DEPARTMENT } = AI_INFO_FIELD.CONTACT;

        if (START_TIME in value && END_TIME in value) {
            return `${value[START_TIME]} - ${value[END_TIME]}`;
        }

        if (AI_INFO_FIELD.DURATION in value) {
            return value[AI_INFO_FIELD.DURATION];
        }

        if (DATE in value) {
            const date = value[DATE];
            const time = TIME in value ? value[TIME] : null;
            return time ? `${date} ${time}` : date;
        }

        if (NAME in value && DEPARTMENT in value) {
            return `${value[NAME]} (${value[DEPARTMENT]})`;
        }

        if (AI_INFO_FIELD.LOCATION in value) {
            return value[AI_INFO_FIELD.LOCATION];
        }

        return Object.values(value).filter(Boolean).join(", ");
    }

    return String(value);
};

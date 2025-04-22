import type { Task } from "@/types/task";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { format } from "date-fns";
import { CardDeleteButton } from "../common";
import { useDeleteTaskMutation } from "@/hooks/api/tasks/use-delete-task-mutation";
import { useToggleTaskStatusMutation } from "@/hooks/api/tasks/use-toggle-task-status-mutation";
import React, { useState, useCallback, useMemo, memo } from "react";
import { cn } from "@/lib/utils";
import { useOpenTaskMutation } from "@/hooks/api/tasks/use-open-task-mutation";
import { ContactAddress } from "../common";
import { TaskStatus } from "@/constants/task-status";
import { useTranslation } from "react-i18next";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { showDeleteToast } from "@/components/ui/undo-toast";
import { useUndoDeleteMutation } from "@/hooks/api/tasks/use-undo-delete-mutation";
import { TOAST_CONFIG } from "@/constants/toast-config";

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
    hasMiddleRowContent: boolean;
    ai: Task["ai"] | undefined;
    onIconMouseEnter: () => void;
    onIconMouseLeave: () => void;
}

interface TaskHeaderActionsProps {
    onDelete: () => void;
    onComplete: () => void;
    isCompleted: boolean;
    allowEdit: boolean;
    isLoading: boolean;
}

// Custom hook to manage task card state and interactions
function useTaskCard(task: Task) {
    const { mutate: deleteTask, isPending: isDeleting } =
        useDeleteTaskMutation();
    const { mutate: toggleTask, isPending: isToggling } =
        useToggleTaskStatusMutation();
    const { mutate: openTask } = useOpenTaskMutation();
    const { mutate: undoDelete } = useUndoDeleteMutation();
    const [showAiSummary, setShowAiSummary] = useState(false);
    const [isMouseOnIcon, setIsMouseOnIcon] = useState(false);

    const isLoading = isDeleting || isToggling;

    const handleDelete = useCallback(() => {
        deleteTask({ id: task.id, title: task.title });

        const { dismiss } = showDeleteToast({
            title: "1 deleted",
            actionLabel: "Undo",
            duration: TOAST_CONFIG.DURATIONS.DEFAULT,
            onAction: () => {
                undoDelete({ id: task.id, title: task.title, task });
                dismiss();
            }
        });
    }, [deleteTask, task, undoDelete]);

    const handleComplete = useCallback(() => {
        toggleTask(task.id);
    }, [toggleTask, task.id]);

    const handleClick = useCallback(
        (e: React.MouseEvent) => {
            if (window.getSelection()?.toString()) {
                return;
            }
            openTask(task.id);
        },
        [openTask, task.id]
    );

    const handleIconMouseEnter = useCallback(() => {
        setIsMouseOnIcon(true);
    }, []);

    const handleIconMouseLeave = useCallback(() => {
        setIsMouseOnIcon(false);
    }, []);

    const handleCardMouseEnter = useCallback(() => {
        setShowAiSummary(true);
    }, []);

    const handleCardMouseLeave = useCallback(() => {
        setShowAiSummary(false);
    }, []);

    const handlePopoverOpenChange = useCallback((open: boolean) => {
        setShowAiSummary(open);
    }, []);

    // Compute derived props
    const contentInfo = useMemo(() => {
        const hasAssignees = task.assignee && task.assignee.length > 0;
        const hasDate = task.date && task.status !== TaskStatus.COMPLETED;
        const hasMiddleRowContent = hasAssignees || hasDate;
        const hasAiInfo = !!task.ai?.popupInfo;
        const isCompleted = task.status === TaskStatus.COMPLETED;

        return {
            hasAssignees,
            hasDate,
            hasMiddleRowContent,
            hasAiInfo,
            isCompleted
        };
    }, [task.assignee, task.date, task.status, task.ai?.popupInfo]);

    return {
        state: {
            showAiSummary,
            isMouseOnIcon,
            isLoading,
            contentInfo
        },
        handlers: {
            handleDelete,
            handleComplete,
            handleClick,
            handleIconMouseEnter,
            handleIconMouseLeave,
            handleCardMouseEnter,
            handleCardMouseLeave,
            handlePopoverOpenChange
        }
    };
}

export function TaskCard({ task, className }: TaskCardProps) {
    const { state, handlers } = useTaskCard(task);
    const { showAiSummary, isMouseOnIcon, isLoading, contentInfo } = state;
    const {
        handleDelete,
        handleComplete,
        handleClick,
        handleIconMouseEnter,
        handleIconMouseLeave,
        handleCardMouseEnter,
        handleCardMouseLeave,
        handlePopoverOpenChange
    } = handlers;

    const {
        hasAssignees,
        hasDate,
        hasMiddleRowContent,
        hasAiInfo,
        isCompleted
    } = contentInfo;

    return (
        <Popover
            open={!isMouseOnIcon && showAiSummary}
            onOpenChange={handlePopoverOpenChange}
        >
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
                                hasMiddleRowContent={Boolean(
                                    hasMiddleRowContent
                                )}
                                ai={task.ai}
                                onIconMouseEnter={handleIconMouseEnter}
                                onIconMouseLeave={handleIconMouseLeave}
                            />

                            {hasMiddleRowContent && (
                                <MiddleContentRow
                                    hasAssignees={hasAssignees}
                                    hasDate={!!hasDate}
                                    taskAssignees={task.assignee}
                                    taskDate={task.date}
                                    taskStatus={task.status}
                                    hasAiInfo={hasAiInfo}
                                    ai={task.ai}
                                    onIconMouseEnter={handleIconMouseEnter}
                                    onIconMouseLeave={handleIconMouseLeave}
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
            {task.ai?.summary && (
                <PopoverContent
                    className="p-3 w-72"
                    side="top"
                    align="center"
                    sideOffset={5}
                    avoidCollisions
                    collisionPadding={10}
                >
                    <div className="text-sm">
                        <div className="text-gray-700 break-words">
                            {task.ai.summary}
                        </div>
                    </div>
                </PopoverContent>
            )}
        </Popover>
    );
}

// Extracted middle content row component
interface MiddleContentRowProps {
    hasAssignees: boolean;
    hasDate: boolean;
    taskAssignees: Task["assignee"];
    taskDate: Task["date"];
    taskStatus: TaskStatus;
    hasAiInfo: boolean;
    ai: Task["ai"] | undefined;
    onIconMouseEnter: () => void;
    onIconMouseLeave: () => void;
}

const MiddleContentRow = memo(function MiddleContentRow({
    hasAssignees,
    hasDate,
    taskAssignees,
    taskDate,
    taskStatus,
    hasAiInfo,
    ai,
    onIconMouseEnter,
    onIconMouseLeave
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

            {hasAiInfo && (
                <div className="flex-shrink-0 ml-2">
                    <AiInfo
                        ai={ai}
                        onIconMouseEnter={onIconMouseEnter}
                        onIconMouseLeave={onIconMouseLeave}
                    />
                </div>
            )}
        </div>
    );
});

const TaskHeader = memo(function TaskHeader({
    title,
    onDelete,
    onComplete,
    isCompleted,
    allowEdit,
    isLoading,
    hasMiddleRowContent,
    ai,
    onIconMouseEnter,
    onIconMouseLeave
}: TaskHeaderProps) {
    const hasAiInfo = !!ai?.popupInfo;

    return (
        <div className="flex justify-between items-start">
            <h3 className="mb-1 font-medium break-words">{title}</h3>

            {/* Move info icon to title row when no middle row content */}
            {!hasMiddleRowContent && hasAiInfo && (
                <div className="flex-shrink-0 mt-0.5 ml-2">
                    <AiInfo
                        ai={ai}
                        onIconMouseEnter={onIconMouseEnter}
                        onIconMouseLeave={onIconMouseLeave}
                    />
                </div>
            )}

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

interface AiInfoProps {
    ai: Task["ai"] | undefined;
    onIconMouseEnter: () => void;
    onIconMouseLeave: () => void;
}

const AiInfo = memo(function AiInfo({
    ai,
    onIconMouseEnter,
    onIconMouseLeave
}: AiInfoProps) {
    const [showAiInfo, setShowAiInfo] = useState(false);

    const handleIconMouseEnter = useCallback(() => {
        setShowAiInfo(true);
        onIconMouseEnter();
    }, [onIconMouseEnter]);

    const handleIconMouseLeave = useCallback(() => {
        setShowAiInfo(false);
        onIconMouseLeave();
    }, [onIconMouseLeave]);

    return (
        <Popover open={showAiInfo} onOpenChange={setShowAiInfo}>
            <PopoverTrigger asChild>
                <div
                    className="flex-shrink-0 cursor-pointer"
                    onClick={(e: React.MouseEvent) => {
                        e.stopPropagation();
                    }}
                    onMouseEnter={handleIconMouseEnter}
                    onMouseLeave={handleIconMouseLeave}
                >
                    <div className="flex justify-center items-center bg-gray-500 rounded-full w-5 h-5 text-white text-center">
                        <span className="inline-flex justify-center items-center w-full h-full font-bold text-xs">
                            i
                        </span>
                    </div>
                </div>
            </PopoverTrigger>
            <PopoverContent
                className="p-3 w-72"
                side="top"
                align="center"
                sideOffset={5}
                avoidCollisions
                collisionPadding={10}
            >
                <div className="text-sm">
                    {ai?.popupInfo &&
                        Array.isArray(ai.popupInfo) &&
                        ai.popupInfo.length > 0 && (
                            <div className="space-y-2">
                                {ai.popupInfo.map((item, index) => (
                                    <InfoItem key={index} item={item} />
                                ))}
                            </div>
                        )}
                </div>
            </PopoverContent>
        </Popover>
    );
});

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

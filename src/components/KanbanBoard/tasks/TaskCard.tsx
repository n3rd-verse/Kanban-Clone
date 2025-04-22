import type { Task } from "@/types/task";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { format } from "date-fns";
import { CardDeleteButton } from "../common";
import { useDeleteTaskMutation } from "@/hooks/api/tasks/use-delete-task-mutation";
import { useToggleTaskStatusMutation } from "@/hooks/api/tasks/use-toggle-task-status-mutation";
import React, { useState, useCallback } from "react";
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
}

interface TaskHeaderActionsProps {
    onDelete: () => void;
    onComplete: () => void;
    isCompleted: boolean;
    allowEdit: boolean;
    isLoading: boolean;
}

export function TaskCard({ task, className }: TaskCardProps) {
    const { mutate: deleteTask, isPending: isDeleting } =
        useDeleteTaskMutation();
    const { mutate: toggleTask, isPending: isToggling } =
        useToggleTaskStatusMutation();
    const { mutate: openTask } = useOpenTaskMutation();
    const { mutate: undoDelete } = useUndoDeleteMutation();
    const { t } = useTranslation();
    const [showAiInfo, setShowAiInfo] = useState(false);

    const handleDelete = useCallback(() => {
        deleteTask({ id: task.id, title: task.title });

        const { dismiss, id } = showDeleteToast({
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

    const isLoading = isToggling || isDeleting;

    return (
        <Popover open={showAiInfo} onOpenChange={setShowAiInfo}>
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
                    onMouseEnter={() => setShowAiInfo(true)}
                    onMouseLeave={() => setShowAiInfo(false)}
                >
                    {isLoading && <LoadingSpinner overlay />}
                    <div className="flex flex-col h-full">
                        <div className="flex-1 min-w-0 max-w-full">
                            <TaskHeader
                                title={task.title}
                                onDelete={handleDelete}
                                onComplete={handleComplete}
                                isCompleted={
                                    task.status === TaskStatus.COMPLETED
                                }
                                allowEdit={task.allowEdit ?? false}
                                isLoading={isLoading}
                            />
                            <TaskAssignees assignees={task.assignee} />
                            <TaskDate date={task.date} status={task.status} />
                            {/* <AiInfo ai={task.ai} /> */}
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

function TaskHeader({
    title,
    onDelete,
    onComplete,
    isCompleted,
    allowEdit,
    isLoading
}: TaskHeaderProps) {
    return (
        <div className="flex justify-between items-center">
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
}

function TaskHeaderActions({
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
}

function TaskAssignees({ assignees }: { assignees: Task["assignee"] }) {
    return (
        <div className="flex items-center gap-2 mt-1 overflow-hidden">
            <div className="flex flex-shrink-0 items-center gap-1 min-w-0">
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
        <div className={`text-sm ${dateColorClass} mt-auto pt-2`}>
            {format(new Date(date), "MMM dd, yyyy")}
        </div>
    );
}

function AiInfo({ ai }: { ai: Task["ai"] | undefined }) {
    return (
        <div className="flex justify-between items-center mt-3 w-full max-w-full text-sm">
            <div className="flex-1 min-w-0 max-w-full">
                <div className="break-words">
                    <span className="font-medium text-[#444]">{ai?.topic}</span>
                    <span className="text-[#666]"> - </span>
                    <span className="text-[#666]">{ai?.summary}</span>
                </div>
            </div>
        </div>
    );
}

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

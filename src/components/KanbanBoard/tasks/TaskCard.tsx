import type { Task } from "@/types/task";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { format } from "date-fns";
import { CardDeleteButton } from "../common";
import React, {
    useCallback,
    memo,
    useMemo,
    useEffect,
    useRef,
    useState
} from "react";
import { cn } from "@/lib/utils";
import { ContactAddress } from "../common";
import { TaskStatus } from "@/constants/task-status";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { useTaskCard } from "@/hooks/kanban/useTaskCard";
import { useSelectionStore } from "@/stores/selection-store";

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

export const TaskCard = memo(function TaskCard({
    task,
    className
}: TaskCardProps) {
    const { state, handlers } = useTaskCard(task);
    const { showAiSummary, isLoading, contentInfo } = state;
    const {
        handleDelete,
        handleComplete,
        handleClick: handleThreadOpen,
        handleCardMouseEnter,
        handleCardMouseLeave,
        handlePopoverOpenChange
    } = handlers;

    // Zustand 스토어에서 선택적으로 필요한 값만 구독하여 불필요한 리렌더링 방지
    const selectedTaskId = useSelectionStore((state) => state.selectedTaskId);
    const selectTask = useSelectionStore((state) => state.selectTask);
    const isSelected = selectedTaskId === task.id;

    // Local selection state to avoid flicker
    const [isLocalSelected, setIsLocalSelected] = useState(isSelected);

    // Sync local state with store but without delay
    useEffect(() => {
        setIsLocalSelected(isSelected);
    }, [isSelected]);

    // Reference to the card element for focusing
    const cardRef = useRef<HTMLDivElement>(null);

    const { hasAssignees, hasDate, hasMiddleRowContent, isCompleted } =
        contentInfo;

    const hasAiContent =
        !!task.ai?.summary ||
        (!!task.ai?.popupInfo &&
            Array.isArray(task.ai.popupInfo) &&
            task.ai.popupInfo.length > 0);

    // Enhanced click handler that immediately updates local state
    const handleCardClick = useCallback(
        (e: React.MouseEvent) => {
            // Prevent selection when clicking on action buttons
            if ((e.target as HTMLElement).closest(".task-card-actions")) {
                return;
            }

            // Stop propagation to prevent bubbling
            e.stopPropagation();

            // Immediately update local selection state
            setIsLocalSelected(true);

            // Apply selection to the store
            selectTask(task.id);

            // No focus change needed for mouse clicks
        },
        [selectTask, task.id]
    );

    // Handle keyboard events for accessibility
    const handleKeyDown = useCallback(
        (e: React.KeyboardEvent) => {
            // Prevent event bubbling for arrow keys - handled by column
            if (
                ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(
                    e.key
                )
            ) {
                e.preventDefault();
                e.stopPropagation();
                return;
            }

            // Enter or Space key to interact with the card
            if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                e.stopPropagation();

                // Immediately update local selection state
                setIsLocalSelected(true);
                selectTask(task.id);

                // If the card is already selected and Enter is pressed again, open thread
                if (isSelected && e.key === "Enter" && hasAiContent) {
                    handleThreadOpen(e as unknown as React.MouseEvent);
                }
            }
        },
        [selectTask, task.id, isSelected, hasAiContent, handleThreadOpen]
    );

    return (
        <Popover open={showAiSummary} onOpenChange={handlePopoverOpenChange}>
            <PopoverTrigger asChild>
                <Card
                    ref={cardRef}
                    className={cn(
                        "p-4", // Removed transition effect
                        "break-words h-full",
                        "group relative",
                        "cursor-pointer overflow-hidden",
                        isLoading && "opacity-50",
                        // Use local state for immediate visual feedback
                        isLocalSelected
                            ? "ring-2 ring-blue-500 ring-offset-1 shadow-md"
                            : "",
                        // When not selected, add hover effect
                        !isLocalSelected &&
                            "hover:shadow-md hover:bg-gray-50 dark:hover:bg-gray-800",
                        // Only remove outline, keep ring for selection
                        "focus:outline-none",
                        className
                    )}
                    onClick={handleCardClick}
                    onMouseEnter={handleCardMouseEnter}
                    onMouseLeave={handleCardMouseLeave}
                    onKeyDown={handleKeyDown}
                    tabIndex={0}
                    role="button"
                    aria-selected={isLocalSelected}
                    data-testid={`task-card-${task.id}`}
                    data-selected={isLocalSelected}
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

                            {/* Thread open button */}
                            {hasAiContent && (
                                <ThreadButton
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleThreadOpen(e);
                                    }}
                                />
                            )}
                        </div>
                    </div>
                </Card>
            </PopoverTrigger>
            {hasAiContent && (
                <TaskInfoPopover
                    summary={task.ai?.summary}
                    popupInfo={
                        Array.isArray(task.ai?.popupInfo)
                            ? task.ai?.popupInfo
                            : []
                    }
                />
            )}
        </Popover>
    );
});

// Extracted Thread Button component
const ThreadButton = memo(function ThreadButton({
    onClick
}: {
    onClick: (e: React.MouseEvent) => void;
}) {
    // Handle keyboard events for accessibility
    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            e.stopPropagation();
            onClick(e as unknown as React.MouseEvent);
        }
    };

    return (
        <div
            className="right-2 bottom-2 absolute bg-gray-100 hover:bg-gray-200 p-1 rounded-full cursor-pointer"
            onClick={onClick}
            onKeyDown={handleKeyDown}
            tabIndex={0}
            role="button"
            aria-label="Open thread"
        >
            <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            >
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
            </svg>
        </div>
    );
});

// Extracted Task Info Popover content
interface TaskInfoPopoverProps {
    summary?: string;
    popupInfo: Record<string, AiInfoValue>[];
}

const TaskInfoPopover = memo(function TaskInfoPopover({
    summary,
    popupInfo
}: TaskInfoPopoverProps) {
    return (
        <PopoverContent
            className="p-3 w-72"
            side="top"
            align="center"
            sideOffset={5}
            avoidCollisions
            collisionPadding={10}
        >
            <div className="space-y-3 text-sm">
                {summary && (
                    <div className="text-gray-700 break-words">{summary}</div>
                )}

                {popupInfo.length > 0 && (
                    <div className="space-y-2 pt-2 border-gray-200 border-t">
                        {popupInfo.map((item, index) => (
                            <InfoItem key={index} item={item} />
                        ))}
                    </div>
                )}
            </div>
        </PopoverContent>
    );
});

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
        <div className="flex items-center gap-2 ml-2 shrink-0 task-card-actions">
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

const TaskAssignees = memo(function TaskAssignees({
    assignees
}: {
    assignees: Task["assignee"];
}) {
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
});

const TaskDate = memo(function TaskDate({
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

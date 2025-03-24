import type { Task } from "@/types/task";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { format } from "date-fns";
import { CardDeleteButton } from "./CardDeleteButton";
import { useDeleteTaskMutation } from "@/hooks/api/tasks/use-delete-task-mutation";
import { useToggleTaskStatusMutation } from "@/hooks/api/tasks/use-toggle-task-status-mutation";
import React, { useState, useCallback } from "react";
import { cn } from "@/lib/utils";
import { useOpenTaskMutation } from "@/hooks/api/tasks/use-open-task-mutation";
import { ContactAddress } from "./ContactAddress";
import { TaskStatus } from "@/constants/task-status";
import { useTranslation } from "react-i18next";

import {
    Popover,
    PopoverContent,
    PopoverTrigger
} from "@/components/ui/popover";

interface TaskCardProps {
    task: Task;
    className?: string;
}

export function TaskCard({ task, className }: TaskCardProps) {
    const { mutate: deleteTask } = useDeleteTaskMutation();
    const { mutate: toggleTask } = useToggleTaskStatusMutation();
    const { mutate: openTask } = useOpenTaskMutation();
    const [startPos, setStartPos] = useState({ x: 0, y: 0 });
    const { t } = useTranslation();
    const handleDelete = useCallback(() => {
        let result = window.confirm(t("task.deleteConfirmation"));
        if (result) {
             deleteTask(task.id);
        }
    }, [deleteTask, task.id]);

    const handleComplete = useCallback(() => {
        toggleTask(task.id);
    }, [toggleTask, task.id]);

    const handleMouseDown = useCallback((e: React.MouseEvent) => {
        setStartPos({ x: e.clientX, y: e.clientY });
    }, []);

    const handleClick = useCallback(
        (e: React.MouseEvent) => {
            const diffX = Math.abs(e.clientX - startPos.x);
            const diffY = Math.abs(e.clientY - startPos.y);
            const threshold = 5;

            if (diffX > threshold || diffY > threshold) {
                // 드래그로 간주하고 클릭 이벤트 무시
                return;
            }

            // 드래그가 아닌 경우 openTask 함수 호출
            openTask(task.id);
        },
        [openTask, task.id, startPos]
    );

    return (
        <Card
            className={cn(
                "p-4 hover:shadow-md transition-shadow",
                "break-words h-full",
                "group relative",
                "cursor-pointer overflow-hidden",
                className
            )}
            onClick={handleClick}
            onMouseDown={handleMouseDown}
        >
            <div className="flex flex-col h-full">
                <div className="flex-1 min-w-0 max-w-full">
                    <TaskHeader
                        title={task.title}
                        onDelete={handleDelete}
                        onComplete={handleComplete}
                        isCompleted={task.status === TaskStatus.COMPLETED}
                        allowEdit={task.allowEdit}
                    />

                    <TaskAssignees assignees={task.assignee} />

                    <TaskDate date={task.date} status={task.status} />

                    <AiInfo ai={task.ai} />
                </div>
            </div>
        </Card>
    );
}

function TaskHeader({
    title,
    onDelete,
    onComplete,
    isCompleted,
    allowEdit
}: {
    title: string;
    onDelete: () => void;
    onComplete: () => void;
    isCompleted: boolean;
    allowEdit: boolean | undefined;
}) {
    return (
        <div className="flex items-center">
            <h3 className="mb-1 font-medium break-words">{title}</h3>

            {/* 버튼 영역 - 타이틀과 세로 중앙 정렬 */}
            <div className="flex items-center gap-2 ml-2 shrink-0">
                <div className="flex items-center">
                    <CardDeleteButton onClick={onDelete} />
                </div>
                <div
                    className="flex items-center"
                    onClick={(e) => e.stopPropagation()}
                >
                    <Checkbox
                        checked={isCompleted}
                        onCheckedChange={onComplete}
                        className="w-5 h-5"
                        disabled={!!allowEdit}
                    />
                </div>
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
    const [showAiInfo, setShowAiInfo] = useState(false);

    if (!ai) return null;

    // AI 정보 렌더링 헬퍼 함수
    const renderPopupInfoValue = (value: any): React.ReactNode => {
        if (typeof value === "string") {
            return value;
        }

        if (value && typeof value === "object") {
            if ("startTime" in value && "endTime" in value) {
                return `${value.startTime} - ${value.endTime}`;
            }
            if ("duration" in value) {
                return value.duration;
            }
            if ("date" in value && "time" in value) {
                return `${value.date} ${value.time}`;
            }
            if ("date" in value) {
                return value.date;
            }
            if ("name" in value && "department" in value) {
                return `${value.name} (${value.department})`;
            }
            if ("location" in value) {
                return value.location;
            }

            return Object.values(value).join(", ");
        }

        return String(value);
    };

    return (
        <div className="flex justify-between items-center mt-3 w-full max-w-full text-sm">
            <div className="flex-1 min-w-0 max-w-[calc(100%-24px)]">
                <div className="break-words">
                    <span className="font-medium text-[#444]">{ai.topic}</span>
                    <span className="text-[#666]"> - </span>
                    <span className="text-[#666]">{ai.summary}</span>
                </div>
            </div>

            {ai.popupInfo && (
                <Popover open={showAiInfo} onOpenChange={setShowAiInfo}>
                    <PopoverTrigger asChild>
                        <div
                            className="flex-shrink-0 self-center ml-1 cursor-pointer"
                            onClick={(e: React.MouseEvent) => {
                                e.stopPropagation();
                            }}
                        >
                            <div className="flex justify-center items-center bg-gray-500 rounded-full w-5 h-5 text-white text-center">
                                <span className="inline-flex justify-center items-center w-full h-full font-bold text-xs">
                                    i
                                </span>
                            </div>
                        </div>
                    </PopoverTrigger>
                    <PopoverContent className="p-3 w-72" side="bottom">
                        <div className="text-sm">
                            {ai.popupInfo &&
                                Array.isArray(ai.popupInfo) &&
                                ai.popupInfo.length > 0 && (
                                    <div className="space-y-2">
                                        {ai.popupInfo.map((item, index) => {
                                            const key = Object.keys(item)[0];
                                            const value = item[key];

                                            return (
                                                <div
                                                    key={index}
                                                    className="flex flex-col gap-1 text-sm"
                                                >
                                                    <div className="text-gray-700 break-words">
                                                        <span className="font-medium">
                                                            {key}:
                                                        </span>{" "}
                                                        <span className="break-words">
                                                            {renderPopupInfoValue(
                                                                value
                                                            )}
                                                        </span>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                        </div>
                    </PopoverContent>
                </Popover>
            )}
        </div>
    );
}

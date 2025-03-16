import type { Task } from "@/types/task";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { format } from "date-fns";
import { CardDeleteButton } from "./CardDeleteButton";
import { useDeleteTaskMutation } from "@/hooks/api/tasks/use-delete-task-mutation";
import { useTaskMutation } from "@/hooks/api/tasks/use-task-mutation";
import React, { useState } from "react";
import { useWindowSize } from "@/hooks/design/use-window-size";
import { COLUMN_SIZES } from "./constants";
import { cn } from "@/lib/utils";
import { useOpenTaskMutation } from "@/hooks/api/tasks/use-open-task-mutation";
import { useOpenContactMutation } from "@/hooks/api/contacts/use-open-contact-mutation";
import { ContactAddress } from "./ContactAddress";
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
    const { mutate: toggleTask } = useTaskMutation();
    const { width } = useWindowSize();
    const { mutate: openTask } = useOpenTaskMutation();
    const { mutate: openContact } = useOpenContactMutation();
    const isDesktop = width >= COLUMN_SIZES.DESKTOP_BREAKPOINT;
    // const [isHovered, setIsHovered] = useState(false);
    const [startPos, setStartPos] = useState({ x: 0, y: 0 });
    const [showAiInfo, setShowAiInfo] = useState(false);

    const dateColorClass =
        task.status === "urgent" ? "text-[#ea384c]" : "text-gray-400";

    const handleDelete = () => {
        deleteTask(task.id);
    };

    const handleComplete = () => {
        toggleTask(task.id);
    };

    const handleMouseDown = (e: React.MouseEvent) => {
        setStartPos({ x: e.clientX, y: e.clientY });
    };

    const handleClick = (e: React.MouseEvent) => {
        const diffX = Math.abs(e.clientX - startPos.x);
        const diffY = Math.abs(e.clientY - startPos.y);
        const threshold = 5;

        if (diffX > threshold || diffY > threshold) {
            // 드래그로 간주하고 클릭 이벤트 무시
            return;
        }

        // 드래그가 아닌 경우 openTask 함수 호출
        openTask(task.id);
    };

    return (
        <Card
            className={cn(
                "p-4 hover:shadow-md transition-shadow",
                "break-words h-full",
                "group relative",
                "cursor-pointer overflow-hidden",
                className
            )}
            // onMouseEnter={() => setIsHovered(true)}
            // onMouseLeave={() => setIsHovered(false)}
            onClick={(e) => {
                handleClick(e);
            }}
            onMouseDown={handleMouseDown}
        >
            <div className="flex flex-col max-w-full h-full">
                <div className="flex justify-between max-w-full">
                    {/* 타이틀과 담당자 영역 - 고정된 너비 유지 */}
                    <div className="flex-1 min-w-0 max-w-full">
                        <div className="flex items-center">
                            <h3 className="mb-1 font-medium break-words">
                                {task.title}
                            </h3>

                            {/* 버튼 영역 - 타이틀과 세로 중앙 정렬 */}
                            <div className="flex items-center gap-2 ml-2 shrink-0">
                                {(!isDesktop || isDesktop) && (
                                    <div className="flex items-center">
                                        <CardDeleteButton
                                            onClick={handleDelete}
                                        />
                                    </div>
                                )}
                                <div
                                    className="flex items-center"
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    <Checkbox
                                        checked={task.status === "completed"}
                                        onCheckedChange={handleComplete}
                                        className="w-5 h-5"
                                        disabled={task.allowEdit}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 mt-1 overflow-hidden">
                            <div className="flex flex-shrink-0 items-center gap-1 min-w-0">
                                {task.assignee.map((assignee, index) => (
                                    <ContactAddress
                                        key={assignee.email}
                                        address={assignee}
                                        showSeparator={
                                            index < task.assignee.length - 1
                                        }
                                    />
                                ))}
                            </div>
                        </div>

                        {task.date && task.status !== "completed" && (
                            <div
                                className={`text-sm ${dateColorClass} mt-auto pt-2`}
                            >
                                {format(new Date(task.date), "MMM dd, yyyy")}
                            </div>
                        )}

                        {task.ai && (
                            <div className="flex justify-between items-center mt-3 w-full max-w-full text-sm">
                                <div className="flex-1 min-w-0 max-w-[calc(100%-24px)]">
                                    <div className="break-words">
                                        <span className="font-medium text-[#444]">
                                            {task.ai.topic}
                                        </span>
                                        <span className="text-[#666]"> - </span>
                                        <span className="text-[#666]">
                                            {task.ai.summary}
                                        </span>
                                    </div>
                                </div>

                                {task.ai.popupInfo && (
                                    <Popover
                                        open={showAiInfo}
                                        onOpenChange={setShowAiInfo}
                                    >
                                        <PopoverTrigger asChild>
                                            <div
                                                className="flex-shrink-0 self-center ml-1 cursor-pointer"
                                                onClick={(
                                                    e: React.MouseEvent
                                                ) => {
                                                    e.stopPropagation();
                                                }}
                                            >
                                                <div className="flex justify-center items-center bg-gray-500 rounded-full w-5 h-5 text-white">
                                                    <span className="font-bold text-xs">
                                                        !
                                                    </span>
                                                </div>
                                            </div>
                                        </PopoverTrigger>
                                        <PopoverContent
                                            className="p-3 w-72"
                                            side="bottom"
                                        >
                                            <div className="font-bold text-sm">
                                                {/* Display popupInfo data */}
                                                {task.ai.popupInfo &&
                                                    Array.isArray(
                                                        task.ai.popupInfo
                                                    ) &&
                                                    task.ai.popupInfo.length >
                                                        0 && (
                                                        <div className="space-y-2">
                                                            {task.ai.popupInfo.map(
                                                                (
                                                                    item,
                                                                    index
                                                                ) => {
                                                                    // 각 객체에서 첫 번째 키-값 쌍 가져오기
                                                                    const key =
                                                                        Object.keys(
                                                                            item
                                                                        )[0];
                                                                    const value =
                                                                        item[
                                                                            key
                                                                        ];

                                                                    return (
                                                                        <div
                                                                            key={
                                                                                index
                                                                            }
                                                                            className="flex items-center gap-2 text-sm"
                                                                        >
                                                                            <div className="text-gray-700">
                                                                                <span className="font-medium">
                                                                                    {
                                                                                        key
                                                                                    }
                                                                                    :
                                                                                </span>{" "}
                                                                                {renderPopupInfoValue(
                                                                                    value
                                                                                )}
                                                                            </div>
                                                                        </div>
                                                                    );
                                                                }
                                                            )}
                                                        </div>
                                                    )}
                                            </div>
                                        </PopoverContent>
                                    </Popover>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </Card>
    );
}

// 팝업 정보값 비효율적 렌더링...
function renderPopupInfoValue(value: any): React.ReactNode {
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
}

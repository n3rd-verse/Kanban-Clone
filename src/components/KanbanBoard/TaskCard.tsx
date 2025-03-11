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
import { AlertCircle } from "lucide-react";
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
    const isDesktop = width >= COLUMN_SIZES.DESKTOP_BREAKPOINT;
    const [isHovered, setIsHovered] = useState(false);
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
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
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
                                    <React.Fragment key={assignee}>
                                        <span className="text-[#3362FF] text-sm truncate">
                                            {assignee}
                                        </span>
                                        {index < task.assignee.length - 1 && (
                                            <span className="text-[#3362FF] text-sm">
                                                {" "}
                                            </span>
                                        )}
                                    </React.Fragment>
                                ))}
                            </div>
                        </div>

                        {task.date && (
                            <div
                                className={`text-sm ${dateColorClass} mt-auto pt-2`}
                            >
                                {format(new Date(task.date), "MMM dd, yyyy")}
                            </div>
                        )}

                        {/* AI Topic Section */}
                        {task.aiTopic && (
                            <div className="flex justify-between items-center mt-3 w-full max-w-full text-sm">
                                <div className="flex flex-1 items-center gap-1.5 min-w-0 max-w-[calc(100%-24px)]">
                                    <span className="flex-shrink-0 font-medium text-[#444] whitespace-nowrap">
                                        AI Topic
                                    </span>
                                    <span className="flex-shrink-0 text-[#666] whitespace-nowrap">
                                        -
                                    </span>
                                    <span className="text-[#666] truncate">
                                        {task.aiSummary}
                                    </span>
                                </div>

                                {task.aiSummary && (
                                    <Popover
                                        open={showAiInfo}
                                        onOpenChange={setShowAiInfo}
                                    >
                                        <PopoverTrigger asChild>
                                            <div
                                                className="flex-shrink-0 ml-1 cursor-pointer"
                                                onClick={(
                                                    e: React.MouseEvent
                                                ) => {
                                                    e.stopPropagation();
                                                }}
                                            >
                                                <AlertCircle className="w-4 h-4 text-amber-500" />
                                            </div>
                                        </PopoverTrigger>
                                        <PopoverContent
                                            className="p-3 w-72"
                                            side="top"
                                        >
                                            <div className="text-sm">
                                                <p className="mb-2 font-medium">
                                                    AI 정보:
                                                </p>
                                                <p className="mb-4">
                                                    {task.aiSummary}
                                                </p>

                                                {/* Additional information in popover */}
                                                {task.id.includes("new") && (
                                                    <div className="space-y-2 mt-2 pt-3 border-t">
                                                        <div className="flex items-center gap-2 text-sm">
                                                            <div className="flex justify-center items-center bg-gray-200 p-1 rounded-full">
                                                                <span className="flex justify-center items-center w-4 h-4 text-gray-600">
                                                                    ⏱️
                                                                </span>
                                                            </div>
                                                            <div className="text-gray-700">
                                                                Lecture Time:
                                                                11:50 - 12:50
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center gap-2 text-sm">
                                                            <div className="flex justify-center items-center bg-gray-200 p-1 rounded-full">
                                                                <span className="flex justify-center items-center w-4 h-4 text-gray-600">
                                                                    ⏱️
                                                                </span>
                                                            </div>
                                                            <div className="text-gray-700">
                                                                QA Session: 20
                                                                minutes
                                                            </div>
                                                        </div>
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

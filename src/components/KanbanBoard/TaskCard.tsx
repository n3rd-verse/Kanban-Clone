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
                "cursor-pointer",
                className
            )}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onClick={(e) => {
                handleClick(e);
            }}
            onMouseDown={handleMouseDown}
        >
            <div className="flex flex-col h-full">
                <div className="flex justify-between">
                    {/* 타이틀과 담당자 영역 - 고정된 너비 유지 */}
                    <div className="flex-1 min-w-0">
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
                                                ,
                                            </span>
                                        )}
                                    </React.Fragment>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
                {task.date && (
                    <div className={`text-sm ${dateColorClass} mt-auto pt-2`}>
                        {format(new Date(task.date), "MMM dd, yyyy")}
                    </div>
                )}
            </div>
        </Card>
    );
}

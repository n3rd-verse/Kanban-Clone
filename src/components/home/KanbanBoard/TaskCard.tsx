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

interface TaskCardProps {
    task: Task;
    className?: string;
}

export function TaskCard({ task, className }: TaskCardProps) {
    const { mutate: deleteTask } = useDeleteTaskMutation();
    const { mutate: toggleTask } = useTaskMutation();
    const { width } = useWindowSize();
    const isDesktop = width >= COLUMN_SIZES.DESKTOP_BREAKPOINT;
    const [isHovered, setIsHovered] = useState(false);

    const dateColorClass =
        task.status === "urgent" ? "text-[#ea384c]" : "text-gray-400";

    const handleDelete = () => {
        deleteTask(task.id);
    };

    const handleComplete = () => {
        toggleTask(task.id);
    };

    return (
        <Card
            className={cn(
                "p-4 hover:shadow-md transition-shadow",
                "break-words h-full",
                "group relative",
                className
            )}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div className="flex flex-col h-full">
                <div className="flex justify-between items-start gap-4">
                    <div
                        className={cn(
                            "flex-1 min-w-0",
                            isDesktop && isHovered ? "pr-8" : "pr-0",
                            "transition-all duration-200"
                        )}
                    >
                        <h3 className="mb-2 font-medium break-words">
                            {task.title}
                        </h3>
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
                    <div className="flex items-center gap-2 shrink-0">
                        {(!isDesktop || (isDesktop && isHovered)) && (
                            <div
                                className={cn(
                                    isDesktop && [
                                        "opacity-0 group-hover:opacity-100",
                                        "transition-all duration-200",
                                        "scale-90 group-hover:scale-100"
                                    ]
                                )}
                            >
                                <CardDeleteButton onClick={handleDelete} />
                            </div>
                        )}
                        <Checkbox
                            checked={
                                task.status === "completed"
                                    ? true
                                    : task.completed
                            }
                            onCheckedChange={handleComplete}
                            className="w-5 h-5"
                            disabled={task.status === "completed"}
                        />
                    </div>
                </div>
                <div className={`text-sm ${dateColorClass} mt-auto pt-2`}>
                    {format(new Date(task.date), "MMM dd, yyyy")}
                </div>
            </div>
        </Card>
    );
}

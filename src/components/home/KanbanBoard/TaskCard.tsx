import type { Task } from "@/types/task";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { format } from "date-fns";
import { CardDeleteButton } from "./CardDeleteButton";
import { useDeleteTaskMutation } from "@/hooks/api/tasks/use-delete-task-mutation";
import { useTaskMutation } from "@/hooks/api/tasks/use-task-mutation";
import React from "react";

interface TaskCardProps {
    task: Task;
    onComplete?: (taskId: string) => void;
}

export const TaskCard = React.memo(function TaskCard({
    task,
    onComplete
}: TaskCardProps) {
    const { mutate: deleteTask } = useDeleteTaskMutation();
    const { mutate: toggleTask } = useTaskMutation();

    const dateColorClass =
        task.status === "urgent" ? "text-[#ea384c]" : "text-gray-400";

    const handleDelete = () => {
        deleteTask(task.id);
    };

    const handleComplete = () => {
        toggleTask(task.id);
    };

    return (
        <Card className="group hover:shadow-lg p-4 min-h-[140px] transition-shadow duration-200">
            <div className="flex flex-col h-full">
                <div className="flex justify-between items-start gap-4">
                    <div className="flex-1 min-w-0">
                        <h3 className="mb-1 font-medium">{task.title}</h3>
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
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                            <CardDeleteButton onClick={handleDelete} />
                        </div>
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
});

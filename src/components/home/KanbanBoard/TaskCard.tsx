import type { Task } from "@/types/task";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { format } from "date-fns";
import { CardDeleteButton } from "./CardDeleteButton";

interface TaskCardProps {
    task: Task;
    onComplete?: (taskId: string) => void;
}

export function TaskCard({ task, onComplete }: TaskCardProps) {
    const dateColorClass =
        task.status === "urgent" ? "text-[#ea384c]" : "text-gray-400";

    const handleDelete = () => {
        console.log("Delete task:", task.id);
    };

    return (
        <Card className="group hover:shadow-lg p-4 transition-shadow duration-200">
            <div className="flex justify-between items-start gap-4">
                <div className="flex-1 space-y-2">
                    <h3 className="font-medium">{task.title}</h3>
                    <div className="flex flex-wrap gap-2">
                        {task.assignee.map((assignee, index) => (
                            <div
                                key={assignee}
                                className="flex items-center text-[#3362FF] text-sm"
                            >
                                {assignee}
                            </div>
                        ))}
                    </div>
                    <div className={`text-sm ${dateColorClass}`}>
                        {format(new Date(task.date), "MMM dd, yyyy")}
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        <CardDeleteButton onClick={handleDelete} />
                    </div>
                    <Checkbox
                        checked={
                            task.status === "completed" ? true : task.completed
                        }
                        onCheckedChange={() => onComplete?.(task.id)}
                        className="w-5 h-5"
                        disabled={task.status === "completed"}
                    />
                </div>
            </div>
        </Card>
    );
}

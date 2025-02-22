import * as React from "react";
import type { Task } from "@/types/task";
import { TaskCard } from "./TaskCard";
import { useTranslation } from "react-i18next";
import { useTasks } from "@/hooks/api/useTasks";
import { ColumnSkeleton } from "./KanbanBoardSkeleton";

const statusColors = {
    new: "text-[#3b82f6] bg-blue-50",
    in_progress: "text-[#fbbf24] bg-amber-50",
    urgent: "text-[#ef4444] bg-red-50",
    completed: "text-[#22c55e] bg-green-50"
};

export function KanbanBoard() {
    const { tasks, isLoading, toggleTaskComplete } = useTasks();
    const { t } = useTranslation();

    if (isLoading) {
        return (
            <div className="min-h-screen">
                <div className="h-16" />
                <main className="p-6">
                    <div className="gap-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
                        {["new", "in_progress", "urgent", "completed"].map(
                            (status) => (
                                <ColumnSkeleton key={status} />
                            )
                        )}
                    </div>
                </main>
            </div>
        );
    }

    // 상태별로 태스크 그룹화
    const groupedTasks = tasks.reduce(
        (acc, task) => {
            if (!acc[task.status]) {
                acc[task.status] = [];
            }
            acc[task.status].push(task);
            return acc;
        },
        {} as Record<string, Task[]>
    );

    return (
        <div className="min-h-screen">
            <div className="h-16" />
            <main className="p-6">
                <div className="gap-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
                    {(
                        ["new", "in_progress", "urgent", "completed"] as const
                    ).map((status) => (
                        <div key={status} className="flex flex-col gap-4">
                            <div className="flex justify-between items-center">
                                <div className="flex items-center gap-2">
                                    <span
                                        className={`px-3 py-1 text-sm rounded-lg font-medium ${statusColors[status]}`}
                                    >
                                        {t(`status.${status}`)}
                                    </span>
                                    <span className="text-gray-500 text-sm">
                                        {groupedTasks[status]?.length || 0}
                                    </span>
                                </div>
                            </div>
                            <div className="space-y-4">
                                {groupedTasks[status]?.map((task) => (
                                    <TaskCard
                                        key={task.id}
                                        task={task}
                                        onComplete={toggleTaskComplete}
                                    />
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </main>
        </div>
    );
}

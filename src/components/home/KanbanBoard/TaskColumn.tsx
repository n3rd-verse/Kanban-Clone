import { useRef, RefObject } from "react";
import { useTranslation } from "react-i18next";
import { TaskDTO, TaskStatus } from "@/types/task";
import { useColumnVirtualizer, useVirtualizedTasks } from "@/hooks/virtualizer";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { TaskCard } from "./TaskCard";
import { taskTransformers } from "@/lib/transformers/task.transformer";
import { STATUS_CONFIG } from "./constants";

interface TaskColumnProps {
    status: TaskStatus;
    maxVisibleTasks?: number;
    width: number;
}

function ColumnHeader({
    status,
    count
}: {
    status: TaskStatus;
    count: number;
}) {
    const { t } = useTranslation();
    const statusConfig = STATUS_CONFIG.find((config) => config.id === status);

    return (
        <div className="flex justify-between items-center">
            <div
                className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg ${statusConfig?.color}`}
            >
                <h3 className="font-medium">{t(`status.${status}`)}</h3>
                <span className="text-sm">({count})</span>
            </div>
        </div>
    );
}

function VirtualizedTaskList({
    tasks,
    virtualizer
}: {
    tasks: TaskDTO[];
    virtualizer: ReturnType<typeof useColumnVirtualizer>;
}) {
    return (
        <div
            className="relative w-full"
            style={{ height: `${virtualizer.getTotalSize()}px` }}
        >
            {virtualizer.getVirtualItems().map((virtualItem) => {
                const task = tasks[virtualItem.index];
                if (!task) return null;

                return (
                    <div
                        key={task.id}
                        data-index={virtualItem.index}
                        className="left-0 absolute w-full"
                        style={{
                            top: `${virtualItem.start}px`,
                            height: "auto",
                            padding: "8px 0"
                        }}
                    >
                        <TaskCard task={taskTransformers.fromDTO(task)} />
                    </div>
                );
            })}
        </div>
    );
}

export function TaskColumn({
    status,
    maxVisibleTasks = 10,
    width
}: TaskColumnProps) {
    const columnRef = useRef<HTMLDivElement>(null) as RefObject<HTMLDivElement>;
    const loadMoreRef = useRef<HTMLDivElement>(
        null
    ) as RefObject<HTMLDivElement>;

    const {
        tasks,
        virtualizer,
        columnStyle,
        scrollbarClass,
        isFetchingNextPage
    } = useVirtualizedTasks({
        status,
        columnRef,
        loadMoreRef,
        maxVisibleTasks,
        width
    });

    return (
        <div className="flex flex-col gap-2">
            <ColumnHeader status={status} count={tasks.length} />
            <div
                ref={columnRef}
                className={`px-2 overflow-x-hidden ${scrollbarClass}`}
                style={columnStyle}
            >
                <VirtualizedTaskList tasks={tasks} virtualizer={virtualizer} />
                <div ref={loadMoreRef} className="h-5" />
                {isFetchingNextPage && <LoadingSpinner className="mt-4" />}
            </div>
        </div>
    );
}

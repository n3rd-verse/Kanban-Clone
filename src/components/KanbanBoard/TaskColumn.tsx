import { useRef, RefObject } from "react";
import { useTranslation } from "react-i18next";
import { Task } from "@/types/task";
import { TaskStatus } from "@/constants/task-status";
import { useColumnVirtualizer, useVirtualizedTasks } from "@/hooks/virtualizer";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { TaskCard } from "./TaskCard";
import { STATUS_CONFIG } from "./constants";
// import { useWindowSize } from "@/hooks/design/use-window-size";
// import { cn } from "@/lib/utils";

interface TaskColumnProps {
    status: TaskStatus;
    maxVisibleTasks?: number;
    width: number;
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
        isFetchingNextPage,
        error
    } = useVirtualizedTasks({
        status,
        columnRef,
        loadMoreRef,
        maxVisibleTasks,
        width
    });

    const { t } = useTranslation();

    if (error) {
        return (
            <div className="p-4 text-red-500">
                Error: {error?.message || t("errors.failedToLoadTasks")}
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-2.5">
            <ColumnHeader status={status} count={tasks.length} />
            <div
                ref={columnRef}
                className="px-0 overflow-visible"
                style={{
                    height: "auto",
                    minHeight: "auto"
                }}
            >
                <VirtualizedTaskList tasks={tasks} virtualizer={virtualizer} />
                <div ref={loadMoreRef} className="h-5" />
                {isFetchingNextPage && <LoadingSpinner className="mt-4" />}
            </div>
        </div>
    );
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
    tasks: Task[];
    virtualizer: ReturnType<typeof useColumnVirtualizer>;
}) {
    return (
        <div
            className="relative w-full"
            style={{
                height: "auto",
                position: "static"
            }}
        >
            {virtualizer.getVirtualItems().map((virtualItem) => {
                const task = tasks[virtualItem.index];
                if (!task) return null;

                return (
                    <div
                        key={task.id}
                        data-index={virtualItem.index}
                        className="relative mb-2 w-full"
                        style={{
                            height: "auto"
                        }}
                    >
                        <TaskCard task={task} className="h-full break-words" />
                    </div>
                );
            })}
        </div>
    );
}

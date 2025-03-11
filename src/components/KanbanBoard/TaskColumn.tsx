import { useRef, RefObject, memo, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { TaskDTO, TaskStatus } from "@/types/task";
import { useColumnVirtualizer, useVirtualizedTasks } from "@/hooks/virtualizer";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { TaskCard } from "./TaskCard";
import { taskTransformers } from "@/lib/transformers/task.transformer";
import { COLUMN_SIZES, STATUS_CONFIG } from "./constants";
import { useWindowSize } from "@/hooks/design/use-window-size";
import { cn } from "@/lib/utils";

interface TaskColumnProps {
    status: TaskStatus;
    maxVisibleTasks?: number;
    width: number;
}

function ColumnHeaderComponent({
    status,
    count
}: {
    status: TaskStatus;
    count: number;
}) {
    const { t } = useTranslation();
    const statusConfig = useMemo(
        () => STATUS_CONFIG.find((config) => config.id === status),
        [status]
    );

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

const ColumnHeader = memo(ColumnHeaderComponent);

function VirtualizedTaskListComponent({
    tasks,
    virtualizer,
    isDesktop
}: {
    tasks: TaskDTO[];
    virtualizer: ReturnType<typeof useColumnVirtualizer>;
    isDesktop: boolean;
}) {
    const virtualItems = virtualizer.getVirtualItems().map((virtualItem) => {
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
                <TaskCard
                    task={taskTransformers.fromDTO(task)}
                    className="h-full break-words"
                />
            </div>
        );
    });

    return (
        <div
            className="relative w-full"
            style={{
                height: "auto",
                position: "static"
            }}
        >
            {virtualItems}
        </div>
    );
}

const VirtualizedTaskList = memo(VirtualizedTaskListComponent);

function TaskColumnComponent({
    status,
    maxVisibleTasks = 10,
    width
}: TaskColumnProps) {
    const columnRef = useRef<HTMLDivElement>(null) as RefObject<HTMLDivElement>;
    const loadMoreRef = useRef<HTMLDivElement>(
        null
    ) as RefObject<HTMLDivElement>;
    // 윈도우 크기에 관계없이 항상 데스크탑 뷰 사용
    const isDesktop = true;

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

    if (error) {
        return (
            <div className="p-4 text-red-500">
                Error: {error?.message || "Failed to load tasks"}
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
                <VirtualizedTaskList
                    tasks={tasks}
                    virtualizer={virtualizer}
                    isDesktop={isDesktop}
                />
                <div ref={loadMoreRef} className="h-5" />
                {isFetchingNextPage && <LoadingSpinner className="mt-4" />}
            </div>
        </div>
    );
}

export const TaskColumn = TaskColumnComponent;

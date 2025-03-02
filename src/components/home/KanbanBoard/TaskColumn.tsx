import { useRef, RefObject } from "react";
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
    virtualizer,
    isDesktop
}: {
    tasks: TaskDTO[];
    virtualizer: ReturnType<typeof useColumnVirtualizer>;
    isDesktop: boolean;
}) {
    return (
        <div
            className="relative w-full"
            style={{
                height: isDesktop ? "auto" : `${virtualizer.getTotalSize()}px`,
                position: isDesktop ? "static" : "relative"
            }}
        >
            {virtualizer.getVirtualItems().map((virtualItem) => {
                const task = tasks[virtualItem.index];
                if (!task) return null;

                return (
                    <div
                        key={task.id}
                        data-index={virtualItem.index}
                        className={cn(
                            "w-full",
                            isDesktop ? "relative mb-4" : "absolute left-0"
                        )}
                        style={{
                            ...(isDesktop
                                ? {}
                                : {
                                      top: `${virtualItem.start}px`,
                                      padding: "6px 0"
                                  }),
                            height: "auto",
                            minHeight: "100px"
                        }}
                    >
                        <TaskCard
                            task={taskTransformers.fromDTO(task)}
                            className="h-full break-words"
                        />
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
    const { width: windowWidth } = useWindowSize();
    const isDesktop = windowWidth >= COLUMN_SIZES.DESKTOP_BREAKPOINT;

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
        <div className="flex flex-col gap-2">
            <ColumnHeader status={status} count={tasks.length} />
            <div
                ref={columnRef}
                className={cn(
                    "px-2",
                    isDesktop
                        ? "overflow-visible"
                        : "overflow-y-auto overflow-x-hidden",
                    scrollbarClass
                )}
                style={{
                    ...columnStyle,
                    height: isDesktop ? "auto" : columnStyle.height,
                    minHeight: isDesktop ? "auto" : "60vh"
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

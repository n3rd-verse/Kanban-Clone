import {
    useRef,
    RefObject,
    useEffect,
    memo,
    useCallback,
    useMemo
} from "react";
import { useTranslation } from "react-i18next";
import { Task } from "@/types/task";
import { TaskStatus } from "@/constants/task-status";
import { useColumnVirtualizer, useVirtualizedTasks } from "@/hooks/virtualizer";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { TaskCard } from "./TaskCard";
import { STATUS_CONFIG } from "../utils/constants";
import { useSelectionStore } from "@/stores/selection-store";
import { Card } from "@/components/ui/card";
import { useKeyboardNavigation } from "@/hooks/kanban/useKeyboardNavigation";
// import { useWindowSize } from "@/hooks/design/use-window-size";
// import { cn } from "@/lib/utils";

interface TaskColumnProps {
    status: TaskStatus;
    maxVisibleTasks?: number;
    width: number;
}

interface TaskColumnContentProps {
    columnRef: RefObject<HTMLDivElement>;
    loadMoreRef: RefObject<HTMLDivElement>;
    tasks: Task[];
    virtualizer: ReturnType<typeof useColumnVirtualizer>;
    isFetchingNextPage: boolean;
    keyboardProps?: React.HTMLAttributes<HTMLDivElement>;
}

interface TaskColumnErrorProps {
    error: Error;
}

interface ColumnHeaderProps {
    status: TaskStatus;
    count: number;
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

    // useCallback으로 래핑하여 함수 안정성 보장
    const updateTasksByStatus = useSelectionStore(
        useCallback((state) => state.updateTasksByStatus, [])
    );

    const {
        tasks: allTasks,
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

    // Filter tasks based on current column status
    const tasks = allTasks.filter((task) => task.status === status);

    // 태스크 ID 배열을 문자열로 변환하여 의존성 최적화
    const taskIds = useMemo(() => {
        return tasks.map((task) => task.id).join(",");
    }, [tasks]);

    // 업데이트 플래그 사용하여 불필요한 업데이트 방지
    const didUpdateRef = useRef(false);

    // Enhanced keyboard navigation with React Aria
    const { keyboardProps } = useKeyboardNavigation({
        containerRef: columnRef,
        enableFocus: true,
        enableScrollIntoView: true
    });

    // 무한 루프 방지를 위해 useEffect 최적화
    useEffect(() => {
        // 빈 태스크 배열이거나 이미 업데이트한 경우 무시
        if (tasks.length === 0 || didUpdateRef.current) return;

        // 컴포넌트 언마운트 시 플래그 리셋
        return () => {
            didUpdateRef.current = false;
        };
    }, []);

    // 태스크 변경 시 한 번만 업데이트
    useEffect(() => {
        if (tasks.length === 0) return;

        // 상태 업데이트는 딱 한 번만 수행
        const timeoutId = setTimeout(() => {
            updateTasksByStatus(status, tasks);
            didUpdateRef.current = true;
        }, 0);

        return () => clearTimeout(timeoutId);
    }, [taskIds, status, updateTasksByStatus]);

    if (error) {
        return <TaskColumnError error={error} />;
    }

    return (
        <div className="flex flex-col gap-2.5">
            <ColumnHeader status={status} count={tasks.length} />
            <TaskColumnContent
                columnRef={columnRef}
                loadMoreRef={loadMoreRef}
                tasks={tasks}
                virtualizer={virtualizer}
                isFetchingNextPage={isFetchingNextPage}
                keyboardProps={keyboardProps}
            />
        </div>
    );
}

// 성능 최적화를 위해 memo 적용
const TaskColumnContent = memo(function TaskColumnContent({
    columnRef,
    loadMoreRef,
    tasks,
    virtualizer,
    isFetchingNextPage,
    keyboardProps
}: TaskColumnContentProps) {
    return (
        <div
            ref={columnRef}
            className="px-0 overflow-visible task-column"
            style={{
                height: "auto",
                minHeight: "auto"
            }}
            // Apply React Aria keyboard props for accessibility
            {...keyboardProps}
            tabIndex={0}
            role="region"
            aria-label="Task column"
        >
            <VirtualizedTaskList tasks={tasks} virtualizer={virtualizer} />
            <div ref={loadMoreRef} className="h-5" />
            {isFetchingNextPage && <LoadingSpinner className="mt-4" />}
        </div>
    );
});

function TaskColumnError({ error }: TaskColumnErrorProps) {
    const { t } = useTranslation();
    return (
        <div className="p-4 text-red-500">
            Error: {error?.message || t("errors.failedToLoadTasks")}
        </div>
    );
}

const ColumnHeader = memo(function ColumnHeader({
    status,
    count
}: ColumnHeaderProps) {
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
});

interface VirtualizedTaskListProps {
    tasks: Task[];
    virtualizer: ReturnType<typeof useColumnVirtualizer>;
}

// 성능 최적화를 위해 memo 적용
const VirtualizedTaskList = memo(function VirtualizedTaskList({
    tasks,
    virtualizer
}: VirtualizedTaskListProps) {
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
});

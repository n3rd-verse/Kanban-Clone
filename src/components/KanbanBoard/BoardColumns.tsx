import { Suspense, memo, useMemo } from "react";
import { QueryErrorBoundary } from "@/components/ErrorBoundary";
import { TaskColumn } from "./TaskColumn";
import { STATUS_CONFIG } from "./constants";
import { ColumnSkeleton } from "./KanbanBoardSkeleton";

interface BoardColumnsProps {
    maxVisibleTasks: number;
    width: number;
}

function TaskColumnsComponent({ maxVisibleTasks, width }: BoardColumnsProps) {
    // Memoize the columns rendering to prevent unnecessary re-renders
    const columns = useMemo(() => {
        return STATUS_CONFIG.map(({ id }) => (
            <QueryErrorBoundary key={id}>
                <Suspense fallback={<ColumnSkeleton />}>
                    <TaskColumn
                        status={id}
                        maxVisibleTasks={maxVisibleTasks}
                        width={width}
                    />
                </Suspense>
            </QueryErrorBoundary>
        ));
    }, [maxVisibleTasks, width]);

    return (
        <div className="content-start gap-2.5 grid grid-cols-4">{columns}</div>
    );
}

// Use React.memo to prevent unnecessary re-renders
export const TaskColumns = memo(TaskColumnsComponent);

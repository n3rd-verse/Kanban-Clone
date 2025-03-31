import { Suspense } from "react";
import { QueryErrorBoundary } from "@/components/ErrorBoundary";
import { TaskColumn } from "../tasks";
import { STATUS_CONFIG } from "../utils/constants";
import { ColumnSkeleton } from "./KanbanBoardSkeleton";

interface BoardColumnsProps {
    maxVisibleTasks: number;
    width: number;
}

export function TaskColumns({ maxVisibleTasks, width }: BoardColumnsProps) {
    return (
        <div
            className="content-start gap-2.5 grid grid-cols-4"
            data-testid="task-columns"
        >
            {STATUS_CONFIG.map(({ id }) => (
                <QueryErrorBoundary key={id}>
                    <Suspense fallback={<ColumnSkeleton />}>
                        <TaskColumn
                            status={id}
                            maxVisibleTasks={maxVisibleTasks}
                            width={width}
                        />
                    </Suspense>
                </QueryErrorBoundary>
            ))}
        </div>
    );
}

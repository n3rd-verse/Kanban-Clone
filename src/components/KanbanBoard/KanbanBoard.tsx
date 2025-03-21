import { Suspense } from "react";
import { TaskColumns } from "./BoardColumns";
import { ScheduleColumn } from "./ScheduleColumn";
import { useResponsiveLayout } from "@/hooks/design/use-responsive-layout";
import { QueryErrorBoundary } from "@/components/ErrorBoundary";
import { ScheduleColumnSkeleton } from "./KanbanBoardSkeleton";

export function KanbanBoard() {
    const { width, maxVisibleTasks } = useResponsiveLayout();
    
    return (
        <div className="min-h-screen">
            <div className="grid grid-cols-[minmax(0,1156fr)_minmax(0,377fr)]">
                <TaskColumns maxVisibleTasks={maxVisibleTasks} width={width} />
                <QueryErrorBoundary>
                    <Suspense fallback={<ScheduleColumnSkeleton />}>
                        <ScheduleColumn />
                    </Suspense>
                </QueryErrorBoundary>
            </div>
        </div>
    );
}

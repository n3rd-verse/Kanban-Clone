import { Suspense, useEffect, useRef } from "react";
import { TaskColumns } from "./BoardColumns";
import { ScheduleColumn } from "../schedules";
import { useResponsiveLayout } from "@/hooks/design/use-responsive-layout";
import { QueryErrorBoundary } from "@/components/ErrorBoundary";
import { ScheduleColumnSkeleton } from "./KanbanBoardSkeleton";
import { useKeyboardNavigation } from "@/hooks/kanban/useKeyboardNavigation";

export function KanbanBoard() {
    const { width, maxVisibleTasks } = useResponsiveLayout();
    const boardRef = useRef<HTMLDivElement>(null);

    // 키보드 네비게이션 훅 호출 (Zustand 스토어에 직접 접근)
    useKeyboardNavigation();

    // 보드에 포커스
    useEffect(() => {
        if (boardRef.current) {
            boardRef.current.focus();
        }
    }, []);

    return (
        <div
            ref={boardRef}
            className="outline-none min-h-screen"
            tabIndex={-1}
            data-testid="kanban-board"
        >
            <div className="grid grid-cols-[minmax(0,1156fr)_minmax(0,377fr)]">
                <TaskColumns maxVisibleTasks={maxVisibleTasks} width={width} />
                <ScheduleColumnWrapper />
            </div>
        </div>
    );
}

function ScheduleColumnWrapper() {
    return (
        <QueryErrorBoundary>
            <Suspense fallback={<ScheduleColumnSkeleton />}>
                <ScheduleColumn />
            </Suspense>
        </QueryErrorBoundary>
    );
}

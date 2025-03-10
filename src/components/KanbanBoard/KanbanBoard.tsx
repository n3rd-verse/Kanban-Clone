import { TaskColumns } from "./BoardColumns";
import { ScheduleColumn } from "./ScheduleColumn";
import { useResponsiveLayout } from "@/hooks/design/use-responsive-layout";

export function KanbanBoard() {
    const { width, maxVisibleTasks } = useResponsiveLayout();

    return (
        <div className="min-h-screen">
            <div className="grid grid-cols-[minmax(0,959fr)_minmax(0,377fr)]">
                <div>
                    <TaskColumns
                        maxVisibleTasks={maxVisibleTasks}
                        width={width}
                    />
                </div>
                <div>
                    <ScheduleColumn />
                </div>
            </div>
        </div>
    );
}

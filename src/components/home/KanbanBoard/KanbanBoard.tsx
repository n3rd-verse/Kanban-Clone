import { BoardColumns } from "./BoardColumns";
import { ScheduleColumn } from "./ScheduleColumn";
import { useResponsiveLayout } from "@/hooks/design/use-responsive-layout";

export function KanbanBoard() {
    const { width, maxVisibleTasks } = useResponsiveLayout();

    return (
        <div className="gap-2 grid xl:grid-cols-5 min-h-screen overflow-y-auto">
            <div className="col-span-full xl:col-span-4">
                <BoardColumns maxVisibleTasks={maxVisibleTasks} width={width} />
            </div>
            <div className="xl:col-span-1 w-full">
                <ScheduleColumn />
            </div>
        </div>
    );
}

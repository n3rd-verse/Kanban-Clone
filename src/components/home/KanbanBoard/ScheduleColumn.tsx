import { useScheduleGroups } from "@/hooks/schedule/use-schedule-groups";
import { ScheduleCard } from "./ScheduleCard";
import { DateHeader } from "./DateHeader";
import type { ScheduleDay } from "@/types/schedule";
import { ScheduleColumnSkeleton } from "./KanbanBoardSkeleton";
import { Suspense } from "react";
import { QueryErrorBoundary } from "@/components/ErrorBoundary";

export function ScheduleColumn() {
    return (
        <QueryErrorBoundary>
            <Suspense fallback={<ScheduleColumnSkeleton />}>
                <ScheduleColumnContent />
            </Suspense>
        </QueryErrorBoundary>
    );
}

function ScheduleColumnContent() {
    const scheduleGroups = useScheduleGroups();

    return (
        <div className="pt-6 md:pt-0 md:pl-6 border-gray-200 border-t md:border-t-0 md:border-l">
            {scheduleGroups.map((dayInfo) => (
                <ScheduleGroup key={dayInfo.id} dayInfo={dayInfo} />
            ))}
        </div>
    );
}

interface ScheduleGroupProps {
    dayInfo: ScheduleDay;
}

function ScheduleGroup({ dayInfo }: ScheduleGroupProps) {
    return (
        <div className="mb-8">
            <DateHeader date={dayInfo.date} />
            <div className="space-y-6">
                {dayInfo.schedules.map((schedule) => (
                    <ScheduleCard key={schedule.id} schedule={schedule} />
                ))}
            </div>
        </div>
    );
}

import { useScheduleGroups } from "@/hooks/schedule/use-schedule-groups";
import { ScheduleCard } from "./ScheduleCard";
import { DateHeader } from "./DateHeader";
import type { ScheduleDay } from "@/types/schedule";
import { useTaskFilter } from "@/hooks/filter/use-task-filter";

interface ScheduleGroupProps {
    dayInfo: ScheduleDay;
}

function ScheduleGroup({ dayInfo }: ScheduleGroupProps) {
    return (
        <div className="mb-4 pl-4 max-w-[281px]">
            <DateHeader date={new Date(dayInfo.date)} type={dayInfo.type} />
            <div className="space-y-2">
                {dayInfo.schedules.map((schedule) => (
                    <ScheduleCard key={schedule.id} schedule={schedule} />
                ))}
            </div>
        </div>
    );
}

export function ScheduleColumn() {
    const { selectedCategories } = useTaskFilter();
    const scheduleGroups = useScheduleGroups({
        categories: selectedCategories
    });

    return (
        <div
            className="ml-8 border-gray-200 border-l"
            data-testid="schedule-column"
        >
            {scheduleGroups.map((dayInfo) => (
                <ScheduleGroup key={dayInfo.id} dayInfo={dayInfo} />
            ))}
        </div>
    );
}

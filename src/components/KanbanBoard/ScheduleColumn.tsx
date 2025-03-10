import { useScheduleGroups } from "@/hooks/schedule/use-schedule-groups";
import { ScheduleCard } from "./ScheduleCard";
import { DateHeader } from "./DateHeader";
import type { ScheduleDay } from "@/types/schedule";

export function ScheduleColumn() {
    const scheduleGroups = useScheduleGroups();

    return (
        <div className="ml-8 border-gray-200 border-l">
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
        <div className="mb-4 pl-4 max-w-[281px]">
            <DateHeader date={new Date(dayInfo.date)} type={dayInfo.type} />
            <div className="space-y-2.5">
                {dayInfo.schedules.map((schedule) => (
                    <ScheduleCard key={schedule.id} schedule={schedule} />
                ))}
            </div>
        </div>
    );
}

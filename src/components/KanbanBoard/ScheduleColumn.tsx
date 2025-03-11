import { memo, useMemo } from "react";
import { useScheduleGroups } from "@/hooks/schedule/use-schedule-groups";
import { ScheduleCard } from "./ScheduleCard";
import { DateHeader } from "./DateHeader";
import type { ScheduleDay } from "@/types/schedule";

function ScheduleColumnComponent() {
    const scheduleGroups = useScheduleGroups();

    const scheduleDayGroups = useMemo(() => {
        return scheduleGroups.map((dayInfo) => (
            <ScheduleGroup key={dayInfo.id} dayInfo={dayInfo} />
        ));
    }, [scheduleGroups]);

    return (
        <div className="ml-8 border-gray-200 border-l">{scheduleDayGroups}</div>
    );
}

interface ScheduleGroupProps {
    dayInfo: ScheduleDay;
}

function ScheduleGroupComponent({ dayInfo }: ScheduleGroupProps) {
    const scheduleCards = useMemo(() => {
        return dayInfo.schedules.map((schedule) => (
            <ScheduleCard key={schedule.id} schedule={schedule} />
        ));
    }, [dayInfo.schedules]);

    return (
        <div className="mb-4 pl-4 max-w-[281px]">
            <DateHeader date={new Date(dayInfo.date)} type={dayInfo.type} />
            <div className="space-y-2">{scheduleCards}</div>
        </div>
    );
}

const ScheduleGroup = memo(ScheduleGroupComponent);
export const ScheduleColumn = memo(ScheduleColumnComponent);

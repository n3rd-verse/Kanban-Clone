import { TaskScheduleCategory } from "@/components/KanbanBoard/task-schedule/TaskScheduleFilter";
import { Address } from "./contact";
import { ScheduleStatus } from "@/constants/schedule-status";

export interface Schedule {
    id: string;
    title: string;
    startTime: string;
    endTime: string;
    attendees: Address[];
    type: "past" | "future";
    location?: string;
    ai?: {
        topic?: string;
        summary?: string;
        popupInfo?: object;
    };
}

export interface ScheduleFilters {
    status?: ScheduleStatus[];
    assignee?: string[];
    dateRange?: {
        start?: Date;
        end?: Date;
    };
    categories?: TaskScheduleCategory[];
    search?: string;
    limit?: number;
    page?: number;
}

export interface ScheduleDay {
    id: string;
    date: string;
    type: "past" | "future";
    schedules: Schedule[];
}

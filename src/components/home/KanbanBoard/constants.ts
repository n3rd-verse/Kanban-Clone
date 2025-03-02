import { TaskStatus } from "@/types/task";

export const COLUMN_SIZES = {
    MOBILE_MAX_TASKS: 6,
    TABLET_MAX_TASKS: 8,
    DESKTOP_MAX_TASKS: 50,
    MOBILE_BREAKPOINT: 640,
    TABLET_BREAKPOINT: 768,
    DESKTOP_BREAKPOINT: 1280,
    BASE_TASK_HEIGHT: 180,
    COLUMN_PADDING: 32,
    MAX_MOBILE_HEIGHT: 400,
    MAX_TABLET_HEIGHT: 600
} as const;

export const BOARD_LAYOUT = {
    GRID_COLUMNS: {
        MOBILE: 1,
        TABLET: 2,
        DESKTOP: 4
    },
    SCHEDULE_SPAN: 1
} as const;

export const VIRTUALIZATION_CONFIG = {
    OVERSCAN: 10,
    ESTIMATED_SIZE: 180,
    PADDING_START: 16,
    PADDING_END: 16,
    INTERSECTION_MARGIN: "200px",
    INTERSECTION_THRESHOLD: 0.1
} as const;

export type TaskStatusConfig = {
    id: TaskStatus;
    label: string;
    color: string;
};

export const STATUS_CONFIG: TaskStatusConfig[] = [
    { id: "new", label: "status.new", color: "text-[#3b82f6] bg-blue-100/50" },
    {
        id: "in_progress",
        label: "status.in_progress",
        color: "text-[#fbbf24] bg-yellow-100/50"
    },
    {
        id: "urgent",
        label: "status.urgent",
        color: "text-[#ef4444] bg-red-100/50"
    },
    {
        id: "completed",
        label: "status.completed",
        color: "text-[#22c55e] bg-green-100/50"
    }
];

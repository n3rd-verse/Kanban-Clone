import { TaskFilters } from "@/types/task";

export const queryKeys = {
    tasks: {
        root: ["tasks"] as const,
        all: () => [...queryKeys.tasks.root] as const,
        list: (filters: TaskFilters) =>
            [...queryKeys.tasks.root, "list", filters] as const,
        detail: (id: string) =>
            [...queryKeys.tasks.root, "detail", id] as const,
        infinite: (filters: TaskFilters) =>
            [...queryKeys.tasks.root, "infinite", filters] as const
    },
    users: {
        root: ["users"] as const,
        all: () => [...queryKeys.users.root] as const,
        detail: (id: string) => [...queryKeys.users.root, "detail", id] as const
    },
    schedules: {
        all: () => ["schedules"] as const,
        detail: (id: string) => ["schedules", id] as const
    }
} as const;

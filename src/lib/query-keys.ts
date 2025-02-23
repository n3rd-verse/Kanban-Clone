export const queryKeys = {
    tasks: {
        root: ["tasks"] as const,
        all: () => [...queryKeys.tasks.root] as const,
        byId: (id: string) => [...queryKeys.tasks.root, { id }] as const
    }
} as const;

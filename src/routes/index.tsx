import * as React from "react";
import { createFileRoute } from "@tanstack/react-router";
import { KanbanBoard } from "@/components/home/KanbanBoard/KanbanBoard";
import { queryClient } from "@/lib/query-config";
import { queryKeys } from "@/lib/query-keys";
import { fetchTasks } from "@/services/tasks";

export const Route = createFileRoute("/")({
    loader: async () => {
        await queryClient.ensureQueryData({
            queryKey: queryKeys.tasks.all(),
            queryFn: fetchTasks
        });
    },
    component: () => <KanbanBoard />
});

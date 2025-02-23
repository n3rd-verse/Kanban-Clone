import * as React from "react";
import { createFileRoute } from "@tanstack/react-router";
import { KanbanBoard } from "@/components/home/KanbanBoard/KanbanBoard";

export const Route = createFileRoute("/")({
    component: () => <KanbanBoard />
});

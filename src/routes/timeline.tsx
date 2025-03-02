import { createFileRoute } from "@tanstack/react-router";
import { Timeline } from "@/components/timeline/Timeline";

export const Route = createFileRoute("/timeline")({
    component: TimelineComponent
});

function TimelineComponent() {
    return <Timeline />;
}

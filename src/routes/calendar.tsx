import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/calendar")({
    component: RouteComponent
});

function RouteComponent() {
    return <div>Calendar View (Coming Soon)</div>;
}

import { createFileRoute } from "@tanstack/react-router";
import { RouteErrorComponent } from "@/components/ErrorComponent";
export const Route = createFileRoute("/calendar")({
    component: RouteComponent,
    errorComponent: RouteErrorComponent
});

function RouteComponent() {
    return <div>Calendar View (Coming Soon)</div>;
}

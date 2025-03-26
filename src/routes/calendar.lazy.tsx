import { createLazyFileRoute } from "@tanstack/react-router";
import { RouteErrorComponent } from "@/components/ErrorComponent";

export const Route = createLazyFileRoute("/calendar")({
    component: RouteComponent,
    errorComponent: RouteErrorComponent
});

function RouteComponent() {
    return <div>Calendar View (Coming Soon)</div>;
}

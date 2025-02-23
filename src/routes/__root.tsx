import * as React from "react";
import {
    Link,
    Outlet,
    createRootRouteWithContext
} from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import type { QueryClient } from "@tanstack/react-query";
import { cn } from "@/lib/utils";
import { LayoutGrid, ListTodo, Calendar as CalendarIcon } from "lucide-react";
import { useTranslation } from "react-i18next";

export const Route = createRootRouteWithContext<{
    queryClient: QueryClient;
}>()({
    component: RootComponent,
    notFoundComponent: () => {
        return (
            <div>
                <p>
                    This is the notFoundComponent configured on root route!!!!
                </p>
                <Link to="/">Start Over</Link>
            </div>
        );
    }
});

function RootComponent() {
    const { t } = useTranslation();

    const views = [
        { id: "/", label: t("navigation.board"), icon: LayoutGrid },
        { id: "/timeline", label: t("navigation.timeline"), icon: ListTodo },
        { id: "/calendar", label: t("navigation.calendar"), icon: CalendarIcon }
    ];

    return (
        <div className="min-h-screen">
            <main className="p-6">
                <div className="flex gap-8 mb-6 border-gray-200 border-b">
                    {views.map((view) => {
                        const Icon = view.icon;
                        return (
                            <Link
                                key={view.id}
                                to={view.id}
                                className={cn(
                                    "px-1 py-4 flex items-center gap-2 text-gray-500 relative transition-colors",
                                    "hover:text-[#3b82f6]"
                                )}
                                activeProps={{
                                    className:
                                        "text-[#3b82f6] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-[#3b82f6]"
                                }}
                                activeOptions={{ exact: view.id === "/" }}
                            >
                                <Icon size={18} />
                                {view.label}
                            </Link>
                        );
                    })}
                </div>
                <Outlet />
            </main>
            <ReactQueryDevtools buttonPosition="top-right" />
            <TanStackRouterDevtools position="bottom-right" />
        </div>
    );
}

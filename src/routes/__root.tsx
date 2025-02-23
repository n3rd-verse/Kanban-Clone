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
            <main>
                <div className="flex gap-8 px-4 border-gray-200 border-b">
                    {views.map((view) => {
                        const Icon = view.icon;
                        return (
                            <Link
                                key={view.id}
                                to={view.id}
                                className={cn(
                                    "py-4 flex items-center gap-2 text-gray-500 relative transition-colors",
                                    "hover:text-[#3b82f6]"
                                )}
                                activeProps={{
                                    className: cn(
                                        "text-[#3b82f6]",
                                        "after:absolute after:bottom-[-1px] after:left-0 after:right-0 after:h-[2px] after:bg-[#3b82f6]"
                                    )
                                }}
                                activeOptions={{ exact: view.id === "/" }}
                            >
                                <Icon size={18} />
                                {view.label}
                            </Link>
                        );
                    })}
                </div>
                <div className="p-6">
                    <Outlet />
                </div>
            </main>
            <ReactQueryDevtools buttonPosition="top-right" />
            <TanStackRouterDevtools position="bottom-right" />
        </div>
    );
}

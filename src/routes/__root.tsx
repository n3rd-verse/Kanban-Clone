import * as React from "react";
import {
    Link,
    Outlet,
    createRootRouteWithContext
} from "@tanstack/react-router";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import type { QueryClient } from "@tanstack/react-query";
import { cn } from "@/lib/utils";
import { CgBoard } from "react-icons/cg";
import { CiCalendar, CiViewTimeline } from "react-icons/ci";
import { useTranslation } from "react-i18next";
import { Toaster } from "@/components/ui/toaster";

const TanStackRouterDevtools =
    process.env.NODE_ENV === "production"
        ? () => null // Render nothing in production
        : React.lazy(() =>
              // Lazy load in development
              import("@tanstack/router-devtools").then((res) => ({
                  default: res.TanStackRouterDevtools
                  // For Embedded Mode
                  // default: res.TanStackRouterDevtoolsPanel
              }))
          );

export const Route = createRootRouteWithContext<{
    queryClient: QueryClient;
}>()({
    component: RootComponent
});

function RootComponent() {
    const { t } = useTranslation();

    const views = React.useMemo(
        () => [
            { id: "/", label: t("navigation.board"), icon: CgBoard },
            {
                id: "/timeline",
                label: t("navigation.timeline"),
                icon: CiViewTimeline
            },
            {
                id: "/calendar",
                label: t("navigation.calendar"),
                icon: CiCalendar
            }
        ],
        [t]
    );

    return (
        <div className="min-h-screen">
            <main>
                <div className="pt-4">
                    <div className="flex items-center px-8 border-gray-200 border-b h-10">
                        {views.map((view, index) => {
                            const Icon = view.icon;
                            return (
                                <Link
                                    key={view.id}
                                    to={view.id}
                                    className={cn(
                                        "flex items-center gap-2 text-gray-500 relative transition-colors font-medium h-10 px-4",
                                        "hover:text-gray-700",
                                        index > 0 && "ml-4"
                                    )}
                                    activeProps={{
                                        className:
                                            "!text-[#3b82f6] after:content-[''] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-[#3b82f6]"
                                    }}
                                    activeOptions={{ exact: view.id === "/" }}
                                >
                                    <Icon size={20} />
                                    {view.label}
                                </Link>
                            );
                        })}
                    </div>
                </div>
                <div className="px-8 pt-4">
                    <Outlet />
                </div>
            </main>
            <Toaster />
            <ReactQueryDevtools buttonPosition="top-right" />
            <TanStackRouterDevtools position="bottom-right" />
        </div>
    );
}

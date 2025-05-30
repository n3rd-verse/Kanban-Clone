import * as React from "react";
import {
    Link,
    Outlet,
    createRootRouteWithContext,
    useMatches
} from "@tanstack/react-router";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import type { QueryClient } from "@tanstack/react-query";
import { cn } from "@/lib/utils";
import { CgBoard } from "react-icons/cg";
import { CiCalendar, CiViewTimeline } from "react-icons/ci";
import { useTranslation } from "react-i18next";
import { Toaster } from "@/components/ui/toaster";
import { TaskScheduleFilter } from "@/components/KanbanBoard/task-schedule/TaskScheduleFilter";
import { useUndoKeyboardShortcut } from "@/hooks/keyboard/use-undo-keyboard-shortcut";

const TanStackRouterDevtools =
    process.env.NODE_ENV === "production"
        ? () => null
        : React.lazy(() =>
              import("@tanstack/router-devtools").then((res) => ({
                  default: res.TanStackRouterDevtools
              }))
          );

export const Route = createRootRouteWithContext<{
    queryClient: QueryClient;
}>()({
    component: RootComponent
});

function RootComponent() {
    const { t } = useTranslation();
    const matches = useMatches();
    const isRootRoute = matches.some((match) => match.routeId === "/");

    useUndoKeyboardShortcut();

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
                    <div className="flex justify-between items-center mr-8 ml-8 border-gray-200 border-b h-10">
                        <div className="flex-1">
                            {/* <div className="flex items-center">
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
                                            activeOptions={{
                                                includeSearch: false
                                            }}
                                        >
                                            <Icon size={20} />
                                            {view.label}
                                        </Link>
                                    );
                                })}
                            </div> */}
                        </div>
                        {isRootRoute && <TaskScheduleFilter />}
                    </div>
                </div>
                <div className="group">
                    <div className="px-8 pt-4 h-[calc(100vh-80px)] overflow-y-auto scrollbar-hover scrollbar-gutter-stable">
                        <Outlet />
                    </div>
                </div>
            </main>
            <Toaster />
            <ReactQueryDevtools buttonPosition="bottom-left" />
            <TanStackRouterDevtools position="bottom-right" />
        </div>
    );
}

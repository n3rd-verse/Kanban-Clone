import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider, createRouter } from "@tanstack/react-router";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/lib/query-config";
import { routeTree } from "./routeTree.gen";
import "./index.css";
import "@/i18n";
import { scan } from "react-scan";
import { queryKeys } from "./lib/query-keys";
import i18n from "@/i18n";

// Set up a Router instance
const router = createRouter({
    routeTree,
    context: {
        queryClient
    },
    defaultPreload: "intent",
    // Since we're using React Query, we don't want loader calls to ever be stale
    // This will ensure that the loader is always called when the route is preloaded or visited
    defaultPreloadStaleTime: 0,
    scrollRestoration: true,
    defaultErrorComponent: ({ error }) => {
        return (
            <div className="flex flex-col justify-center items-center h-screen">
                <h1 className="font-bold text-2xl">Error</h1>
                <p className="text-gray-500">{error.message}</p>
            </div>
        );
    },
    defaultNotFoundComponent: () => {
        return (
            <div className="flex flex-col justify-center items-center h-screen">
                <h1 className="font-bold text-2xl">Not Found</h1>
            </div>
        );
    }
});

// Register things for typesafety
declare module "@tanstack/react-router" {
    interface Register {
        router: typeof router;
    }
}


scan({
    enabled: true
});

const rootElement = document.getElementById("app")!;

if (!rootElement.innerHTML) {
    const root = ReactDOM.createRoot(rootElement);
    root.render(
        <QueryClientProvider client={queryClient}>
            <RouterProvider router={router} />
        </QueryClientProvider>
    );
}

window.refreshTasks = async () => {
    await queryClient.refetchQueries({ queryKey: queryKeys.tasks.all() });
};

window.refreshSchedules = async () => {
    await queryClient.refetchQueries({ queryKey: queryKeys.schedules.all() });
};

window.changeLanguage = (lang: string) => {
    i18n.changeLanguage(lang);
};
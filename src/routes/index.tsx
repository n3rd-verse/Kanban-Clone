// import { useEffect } from "react";
import {
    createFileRoute
    // ErrorComponent,
    // ErrorComponentProps,
    // useRouter
} from "@tanstack/react-router";
import { KanbanBoard } from "@/components/home/KanbanBoard/KanbanBoard";
import { queryClient } from "@/lib/query-config";
import { queryKeys } from "@/lib/query-keys";
import { fetchTasks } from "@/services/tasks";
// import { useQueryErrorResetBoundary } from "@tanstack/react-query";
// import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({
    loader: async () => {
        await queryClient.ensureQueryData({
            queryKey: queryKeys.tasks.all(),
            queryFn: fetchTasks
        });
    },
    // errorComponent: IndexErrorComponent,
    component: () => <KanbanBoard />
});

// export function IndexErrorComponent({ error }: ErrorComponentProps) {
//     const router = useRouter();

//     const queryErrorResetBoundary = useQueryErrorResetBoundary();

//     useEffect(() => {
//         queryErrorResetBoundary.reset();
//     }, [queryErrorResetBoundary]);

//     return (
//         <div>
//             <Button
//                 onClick={() => {
//                     router.invalidate();
//                 }}
//             >
//                 retry
//             </Button>
//             <ErrorComponent error={error} />
//         </div>
//     );
// }

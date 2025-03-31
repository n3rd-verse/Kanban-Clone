import { useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/query-keys";
import { toggleTaskStatus } from "@/services/tasks";
// import type { Task, TasksResponse } from "@/types/task";
import { useToast } from "@/components/ui/use-toast";
import { useTranslation } from "react-i18next";
// import { TASK_STATUSES, TaskStatus } from "@/constants/task-status";

// function getToggleStatusInfo(
//     taskId: string,
//     queryClient: ReturnType<typeof useQueryClient>
// ) {
//     let taskToUpdate: Task | undefined;
//     let sourceStatus: TaskStatus | undefined;

//     for (const status of TASK_STATUSES) {
//         const queryKey = queryKeys.tasks.infinite({ status: [status] });
//         const data = queryClient.getQueryData<{ pages: TasksResponse[] }>(
//             queryKey
//         );
//         if (!data?.pages) continue;

//         const allTasks = data.pages.flatMap((p: TasksResponse) => p.tasks);
//         const task = allTasks.find((t: Task) => t.id === taskId);

//         if (task) {
//             taskToUpdate = task;
//             sourceStatus = status;
//             break;
//         }
//     }

//     if (!taskToUpdate || !sourceStatus) return null;

//     const targetStatus: TaskStatus =
//         taskToUpdate.status === TaskStatus.COMPLETED
//             ? TaskStatus.NEW
//             : TaskStatus.COMPLETED;
//     const updatedTask = { ...taskToUpdate, status: targetStatus };

//     return { taskToUpdate, sourceStatus, targetStatus, updatedTask };
// }

export function useToggleTaskStatusMutation() {
    const queryClient = useQueryClient();
    const { toast } = useToast();
    const { t } = useTranslation();

    return useMutation({
        mutationFn: toggleTaskStatus,
        onError: (error) => {
            toast({
                variant: "destructive",
                title: t("toast.titles.error"),
                description:
                    error instanceof Error
                        ? error.message
                        : t("errors.failedToUpdateTask")
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: queryKeys.tasks.root
            });
        }
    });
}

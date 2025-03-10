import { useMutation, useQueryClient } from "@tanstack/react-query";
import { openTask } from "@/services/tasks";

export function useOpenTaskMutation() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: openTask,
        onError: (error, taskId, context) => {
            console.error("openTask failed :", error);
        },
        // 필요한 경우 성공 후 추가 작업을 처리할 수 있습니다.
        onSuccess: (data, taskId, context) => {
            console.log(`Task ${taskId} opened successfully.`);
        },
    });
}

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { openSchedule } from "@/services/schedules";

export function useOpenScheduleMutation() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: openSchedule,
        onError: (error, scheduleId, context) => {
            console.error("openSchedule failed :", error);
        },
        // 필요한 경우 성공 후 추가 작업을 처리할 수 있습니다.
        onSuccess: (data, scheduleId, context) => {
            // console.log(`Schedule ${scheduleId} opened successfully.`);
        }
    });
}

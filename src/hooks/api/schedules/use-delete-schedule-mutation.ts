import { useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/query-keys";
import { deleteSchedule } from "@/services/schedules";
import { useToast } from "@/components/ui/use-toast";
import { useTranslation } from "react-i18next";
import { ScheduleDay } from "@/types/schedule";

export function useDeleteScheduleMutation() {
    const queryClient = useQueryClient();
    const { toast } = useToast();
    const { t } = useTranslation();

    return useMutation({
        mutationFn: deleteSchedule,
        onMutate: async (scheduleId: string) => {
            // Cancel any outgoing refetches
            await queryClient.cancelQueries({
                queryKey: queryKeys.schedules.all()
            });

            // Snapshot the previous value
            const previousSchedules = queryClient.getQueryData<ScheduleDay[]>(
                queryKeys.schedules.all()
            );

            // Optimistically update schedules
            queryClient.setQueryData<ScheduleDay[]>(
                queryKeys.schedules.all(),
                (old) => {
                    if (!old) return old;
                    return old
                        .map((day) => ({
                            ...day,
                            schedules: day.schedules.filter(
                                (schedule) => schedule.id !== scheduleId
                            )
                        }))
                        .filter((day) => day.schedules.length > 0);
                }
            );

            return { previousSchedules };
        },
        onError: (error, scheduleId, context) => {
            // Revert to the previous value
            if (context?.previousSchedules) {
                queryClient.setQueryData(
                    queryKeys.schedules.all(),
                    context.previousSchedules
                );
            }

            toast({
                variant: "destructive",
                title: t("toast.titles.error"),
                description:
                    error instanceof Error
                        ? error.message
                        : t("errors.failedToDeleteSchedule")
            });

            console.error("Failed to delete schedule:", error);
        }
        // onSuccess: () => {
        //     queryClient.invalidateQueries({
        //         queryKey: queryKeys.schedules.all()
        //     });

        //     toast({
        //         title: t("toast.titles.success"),
        //         description: t("toast.descriptions.scheduleDeleted")
        //     });
        // }
    });
}

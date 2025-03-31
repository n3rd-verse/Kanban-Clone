import { useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/query-keys";
import { deleteSchedule } from "@/services/schedules";
import { useToast } from "@/components/ui/use-toast";
import { useTranslation } from "react-i18next";

export function useDeleteScheduleMutation() {
    const queryClient = useQueryClient();
    const { toast } = useToast();
    const { t } = useTranslation();

    return useMutation({
        mutationFn: deleteSchedule,
        onError: (error) => {
            toast({
                variant: "destructive",
                title: t("toast.titles.error"),
                description:
                    error instanceof Error
                        ? error.message
                        : t("errors.failedToDeleteSchedule")
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: queryKeys.schedules.all
            });
        }
    });
}

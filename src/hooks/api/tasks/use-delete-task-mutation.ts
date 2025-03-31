import { useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/query-keys";
import { deleteTask } from "@/services/tasks";
import { useToast } from "@/components/ui/use-toast";
import { useTranslation } from "react-i18next";

export function useDeleteTaskMutation() {
    const queryClient = useQueryClient();
    const { toast } = useToast();
    const { t } = useTranslation();

    return useMutation({
        mutationFn: deleteTask,
        onError: (error) => {
            toast({
                variant: "destructive",
                title: t("toast.titles.error"),
                description:
                    error instanceof Error
                        ? error.message
                        : t("errors.failedToDeleteTask")
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: queryKeys.tasks.root
            });
        }
    });
}

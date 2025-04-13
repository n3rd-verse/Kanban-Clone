import { useMutation, useQueryClient } from "@tanstack/react-query";
import { undoDelete } from "@/services/tasks";
import { queryKeys } from "@/lib/query-keys";
import { useToast } from "@/components/ui/use-toast";
import { useTranslation } from "react-i18next";

export function useUndoDeleteMutation() {
    const queryClient = useQueryClient();
    const { toast } = useToast();
    const { t } = useTranslation();

    return useMutation({
        mutationFn: (taskId: string) => undoDelete(taskId),

        onSuccess: () => {
            // 작업 목록 데이터 무효화하여 다시 불러오기
            queryClient.invalidateQueries({ queryKey: [queryKeys.tasks] });

            // toast({
            //     title: t("toast.titles.success"),
            //     description:
            //         t("toast.descriptions.taskRestored") ||
            //         "Task restored successfully"
            // });
        },

        onError: (error) => {
            toast({
                variant: "destructive",
                title: t("toast.titles.error"),
                description:
                    error instanceof Error
                        ? error.message
                        : "Failed to restore task"
            });
        }
    });
}

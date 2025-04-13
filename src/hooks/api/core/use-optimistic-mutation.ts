import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/components/ui/use-toast";
import { useTranslation } from "react-i18next";

export interface OptimisticMutationConfig<TData, TError, TVariables, TContext> {
    mutationFn: (variables: TVariables) => Promise<TData>;
    queryKey: string[];

    optimisticUpdate?: (
        queryClient: ReturnType<typeof useQueryClient>,
        variables: TVariables,
        context?: any
    ) => { previousStates?: Map<any, any>; [key: string]: any };

    onSuccess?: (
        data: TData,
        variables: TVariables,
        context: TContext
    ) => void | Promise<void>;

    errorTitle?: string;
    errorDescription?: (error: TError, variables: TVariables) => string;
    fallbackErrorMessage?: string;
}

/**
 * A utility hook for creating mutations with optimistic updates
 *
 * @template TData The type of data returned by the mutation
 * @template TError The type of error returned by the mutation
 * @template TVariables The type of variables for the mutation
 * @template TContext The type of context returned by onMutate
 */
export function useOptimisticMutation<
    TData = unknown,
    TError = unknown,
    TVariables = void,
    TContext = unknown
>({
    mutationFn,
    queryKey,
    optimisticUpdate,
    onSuccess,
    errorTitle,
    errorDescription,
    fallbackErrorMessage = "An error occurred"
}: OptimisticMutationConfig<TData, TError, TVariables, TContext>) {
    const queryClient = useQueryClient();
    const { toast } = useToast();
    const { t } = useTranslation();

    return useMutation({
        mutationFn,

        onMutate: async (variables: TVariables) => {
            await queryClient.cancelQueries({ queryKey });

            let context: any = {};

            if (optimisticUpdate) {
                context = optimisticUpdate(queryClient, variables, context);
            }

            return context as TContext;
        },

        onSuccess: async (data, variables, context) => {
            if (onSuccess) {
                await onSuccess(data, variables, context);
            }
        },

        onError: (error: TError, variables, context: any) => {
            if (context?.previousStates) {
                context.previousStates.forEach((data: any, queryKey: any) => {
                    queryClient.setQueryData(queryKey, data);
                });
            }

            toast({
                title: errorTitle || t("toast.titles.error"),
                variant: "destructive",
                description: errorDescription
                    ? errorDescription(error, variables)
                    : error instanceof Error
                      ? error.message
                      : fallbackErrorMessage
            });
        }
    });
}

/**
 * Helper function to store previous states of queries
 */
export function storePreviousStates(
    queryClient: ReturnType<typeof useQueryClient>,
    queryKey: string[]
) {
    const previousStates = new Map();

    const queries = queryClient.getQueriesData({ queryKey });
    queries.forEach(([queryKey, data]: any) => {
        previousStates.set(queryKey, data);
    });

    return previousStates;
}

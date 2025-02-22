import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { Task } from "@/types/task";
import { mockTasks } from "@/mocks/mockData";

export function useTasks() {
    const queryClient = useQueryClient();

    const { data: tasks = [], isLoading } = useQuery({
        queryKey: ["tasks"],
        queryFn: async () => {
            // 실제 API 호출을 시뮬레이트
            await new Promise((resolve) => setTimeout(resolve, 500));
            return mockTasks;
        }
    });

    const { mutate: toggleTaskComplete } = useMutation({
        mutationFn: async (taskId: string) => {
            const task = tasks.find((t) => t.id === taskId);
            if (!task) return;
            return { ...task, completed: !task.completed };
        },
        onMutate: async (taskId) => {
            const previousTasks = queryClient.getQueryData<Task[]>(["tasks"]);
            queryClient.setQueryData<Task[]>(["tasks"], (old) =>
                old?.map((task) =>
                    task.id === taskId
                        ? { ...task, completed: !task.completed }
                        : task
                )
            );
            return { previousTasks };
        },
        onError: (_, __, context) => {
            queryClient.setQueryData(["tasks"], context?.previousTasks);
        }
    });

    return {
        tasks,
        isLoading,
        toggleTaskComplete
    };
}

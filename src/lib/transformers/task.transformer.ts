import type { TaskDTO, Task, TaskFilters } from "@/types/task";

export const taskTransformers = {
    fromDTO: (dto: TaskDTO): Task => ({
        id: dto.id,
        title: dto.title,
        assignee: Array.isArray(dto.assignee) ? dto.assignee : [dto.assignee],
        date: dto.date ? new Date(dto.date).toISOString() : undefined,
        status: dto.status,
        allowEdit: dto.allowEdit,
        ai: dto.ai
    }),

    toDTO: (task: Partial<Task>): Partial<TaskDTO> => ({
        id: task.id,
        title: task.title,
        assignee: task.assignee,
        date: task.date,
        status: task.status,
        allowEdit: task.allowEdit,
        ai: task.ai
    }),

    transformFilters: (filters: TaskFilters) => ({
        status: filters.status,
        assignee: filters.assignee,
        startDate: filters.dateRange?.start?.toISOString(),
        endDate: filters.dateRange?.end?.toISOString()
    })
};

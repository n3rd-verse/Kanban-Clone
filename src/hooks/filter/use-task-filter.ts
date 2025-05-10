import { useNavigate, useSearch } from "@tanstack/react-router";
import { Route } from "@/routes";
import { TaskScheduleCategory } from "@/components/KanbanBoard/task-schedule/TaskScheduleFilter";

/**
 * Manages task category filters stored in the URL query parameters.
 * @returns An object containing:
 *   - selectedCategories: currently applied category filters.
 *   - toggleCategory: function to add or remove a category filter.
 *   - clearCategories: function to reset all category filters.
 */
export function useTaskFilter() {
    const search = useSearch({ from: Route.fullPath }) as {
        categories?: TaskScheduleCategory[];
    };
    const navigate = useNavigate();

    const toggleCategory = (categoryId: TaskScheduleCategory) => {
        const currentCategories = search.categories || [];
        const newCategories = currentCategories.includes(categoryId)
            ? currentCategories.filter(
                  (id: TaskScheduleCategory) => id !== categoryId
              )
            : [...currentCategories, categoryId];

        navigate({
            to: Route.fullPath,
            search: {
                categories: newCategories
            }
        });
    };

    const deleteAllTasksAndSchedules = () => {
        navigate({
            to: Route.fullPath,
            search: {
                categories: []
            }
        });
    };

    return {
        selectedCategories: search.categories || [],
        toggleCategory,
        deleteAllTasksAndSchedules
    } as const;
}

import { useNavigate, useSearch } from "@tanstack/react-router";
import { Route } from "@/routes";
import { TaskCategory } from "@/components/KanbanBoard/tasks/TaskFilter";

/**
 * Manages task category filters stored in the URL query parameters.
 * @returns An object containing:
 *   - selectedCategories: currently applied category filters.
 *   - toggleCategory: function to add or remove a category filter.
 *   - clearCategories: function to reset all category filters.
 */
export function useTaskFilter() {
    const search = useSearch({ from: Route.fullPath }) as {
        categories?: TaskCategory[];
    };
    const navigate = useNavigate();

    const toggleCategory = (categoryId: TaskCategory) => {
        const currentCategories = search.categories || [];
        const newCategories = currentCategories.includes(categoryId)
            ? currentCategories.filter((id: TaskCategory) => id !== categoryId)
            : [...currentCategories, categoryId];

        navigate({
            to: Route.fullPath,
            search: {
                categories: newCategories
            }
        });
    };

    const clearCategories = () => {
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
        clearCategories
    } as const;
}

import { useNavigate, useSearch } from "@tanstack/react-router";
import { Route } from "@/routes";
import { TaskCategory } from "@/components/KanbanBoard/tasks/TaskFilter";

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

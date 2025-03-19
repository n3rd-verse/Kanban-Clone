import { useNavigate, useSearch } from "@tanstack/react-router";
import { Route } from "@/routes";

type FilterType = "important" | "company" | "news" | "other";

export function useTaskFilter() {
    const search = useSearch({ from: Route.fullPath });
    const navigate = useNavigate();

    const toggleFilter = (filterId: FilterType) => {
        const currentFilters = search.filters;
        const newFilters = currentFilters.includes(filterId)
            ? currentFilters.filter((id: FilterType) => id !== filterId)
            : [...currentFilters, filterId];

        navigate({
            to: Route.fullPath,
            search: {
                filters: newFilters
            }
        });
    };

    const clearFilters = () => {
        navigate({
            to: Route.fullPath,
            search: {
                filters: []
            }
        });
    };

    return {
        selectedFilters: search.filters,
        toggleFilter,
        clearFilters
    } as const;
}

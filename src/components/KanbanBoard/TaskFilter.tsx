import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Check } from "lucide-react";
import { Filter } from "lucide-react";
import { useTaskFilter } from "@/hooks/filter/use-task-filter";

type FilterType = "important" | "company" | "news" | "other";

type FilterOption = {
    id: FilterType;
    label: string;
};

const FILTER_OPTIONS: FilterOption[] = [
    { id: "important", label: "Important" },
    { id: "company", label: "Company" },
    { id: "news", label: "News" },
    { id: "other", label: "Other" }
];

export function TaskFilter() {
    const { selectedFilters, toggleFilter } = useTaskFilter();

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="ghost"
                    size="icon"
                    className={cn(
                        "h-8 w-8",
                        selectedFilters.length > 0
                            ? "text-blue-500"
                            : "text-gray-500"
                    )}
                >
                    <Filter className="w-4 h-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="p-1 w-48">
                {FILTER_OPTIONS.map((option) => (
                    <button
                        key={option.id}
                        onClick={() => toggleFilter(option.id)}
                        className={cn(
                            "flex items-center justify-between w-full px-3 py-2 text-sm rounded-md hover:bg-gray-100",
                            "transition-colors duration-150 ease-in-out"
                        )}
                    >
                        <span>{option.label}</span>
                        <div
                            className={cn(
                                "flex items-center justify-center w-5 h-5 rounded-sm border transition-colors",
                                selectedFilters.includes(option.id)
                                    ? "bg-blue-500 border-blue-500"
                                    : "border-gray-300"
                            )}
                        >
                            {selectedFilters.includes(option.id) && (
                                <Check className="w-3.5 h-3.5 text-white" />
                            )}
                        </div>
                    </button>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

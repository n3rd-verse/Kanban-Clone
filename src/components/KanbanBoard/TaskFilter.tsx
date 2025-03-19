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
            <DropdownMenuContent
                align="end"
                className={cn(
                    "shadow-lg p-0",
                    "shadow-lg p-0 rounded-lg",
                    // Base size for smaller screens
                    "w-[140px] h-[128px]",
                    // Medium size
                    "md:w-[150px] md:h-[136px]",
                    // Target size for 1336x943
                    "xl:w-[160px] xl:h-[144px]",
                    // Larger screens
                    "2xl:w-[176px] 2xl:h-[152px]"
                )}
            >
                <div className="py-2">
                    {FILTER_OPTIONS.map((option) => (
                        <button
                            key={option.id}
                            onClick={() => toggleFilter(option.id)}
                            className={cn(
                                "flex items-center justify-between w-full px-4 py-2",
                                "hover:bg-gray-50 transition-colors duration-150 ease-in-out"
                            )}
                        >
                            <span className="text-[15px] text-gray-900 leading-5">
                                {option.label}
                            </span>
                            {selectedFilters.includes(option.id) && (
                                <Check className="ml-2 w-[18px] h-[18px] text-blue-500" />
                            )}
                        </button>
                    ))}
                </div>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

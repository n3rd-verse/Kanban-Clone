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
                    "shadow-lg p-0 rounded-lg",
                    // 반응형 너비와 높이 설정
                    "w-[160px] h-auto",
                    "md:w-[170px]",
                    "lg:w-[180px]",
                    "xl:w-[180px]",
                    "2xl:w-[200px]"
                )}
                sideOffset={5}
            >
                <div className="py-2">
                    {FILTER_OPTIONS.map((option) => (
                        <button
                            key={option.id}
                            onClick={() => toggleFilter(option.id)}
                            className={cn(
                                "flex items-center justify-between w-full px-3 py-2",
                                "md:px-4 md:py-2.5",
                                "hover:bg-gray-50 transition-colors duration-150 ease-in-out"
                            )}
                        >
                            <span
                                className={cn(
                                    "text-xs text-gray-900 leading-4",
                                    "sm:text-sm",
                                    "md:text-[14px] md:leading-5",
                                    "lg:text-[15px]",
                                    "xl:text-base"
                                )}
                            >
                                {option.label}
                            </span>
                            {selectedFilters.includes(option.id) && (
                                <Check
                                    className={cn(
                                        "ml-1 w-[14px] h-[14px] text-blue-500",
                                        "md:ml-2 md:w-[16px] md:h-[16px]",
                                        "lg:w-[18px] lg:h-[18px]"
                                    )}
                                />
                            )}
                        </button>
                    ))}
                </div>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Check } from "lucide-react";
import { useTaskFilter } from "@/hooks/filter/use-task-filter";
import filterIcon from "@/assets/icons/filter.svg";
import { Icon } from "@/components/common/Icon";
import { useTranslation } from "react-i18next";

export enum TaskCategory {
    IMPORTANT = "important",
    COMPANY = "company",
    NEWS = "news",
    OTHER = "other"
}

export enum DeleteAll {
    DELETE_ALL = "delete_all"
}

type CategoryOption = {
    id: TaskCategory | DeleteAll;
    translationKey: string;
};

const CATEGORY_OPTIONS: CategoryOption[] = [
    { id: TaskCategory.IMPORTANT, translationKey: "categories.important" },
    { id: TaskCategory.COMPANY, translationKey: "categories.company" },
    { id: TaskCategory.NEWS, translationKey: "categories.news" },
    { id: TaskCategory.OTHER, translationKey: "categories.other" }
    // { id: DeleteAll.DELETE_ALL, translationKey: "categories.delete_all" }
];

export function TaskFilter() {
    const { selectedCategories, toggleCategory, deleteAllTasksAndSchedules } =
        useTaskFilter();
    const hasFilter = selectedCategories.length > 0;
    const { t } = useTranslation();

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="ghost"
                    size="icon"
                    className="w-8 h-8"
                    onClick={(e) => {
                        e.stopPropagation();
                    }}
                >
                    <Icon
                        src={filterIcon}
                        alt={t("filter")}
                        style={{
                            filter: !hasFilter
                                ? ""
                                : "invert(40%) sepia(100%) saturate(1000%) hue-rotate(204deg) brightness(100%) contrast(100%)"
                        }}
                    />
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
                    {CATEGORY_OPTIONS.map((option) => (
                        <button
                            key={option.id}
                            onClick={() => {
                                if (option.id === DeleteAll.DELETE_ALL) {
                                    deleteAllTasksAndSchedules();
                                    return;
                                }
                                toggleCategory(option.id);
                            }}
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
                                {t(option.translationKey)}
                            </span>
                            {option.id !== DeleteAll.DELETE_ALL &&
                                selectedCategories.includes(option.id) && (
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

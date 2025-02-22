import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";
import { LayoutGrid, ListTodo, Calendar as CalendarIcon } from "lucide-react";

interface NavigationProps {
    activeView: string;
    onViewChange: (view: string) => void;
}

export function Navigation({ activeView, onViewChange }: NavigationProps) {
    const { t } = useTranslation();

    const views = [
        { id: "board", label: t("navigation.board"), icon: LayoutGrid },
        { id: "timeline", label: t("navigation.timeline"), icon: ListTodo },
        { id: "calendar", label: t("navigation.calendar"), icon: CalendarIcon }
    ];

    return (
        <div className="flex gap-8 mb-6 border-gray-200 border-b">
            {views.map((view) => {
                const Icon = view.icon;
                return (
                    <button
                        key={view.id}
                        onClick={() => onViewChange(view.id)}
                        className={cn(
                            "px-1 py-4 flex items-center gap-2 text-gray-500 relative",
                            activeView === view.id && [
                                "text-[#3b82f6]",
                                "after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-[#3b82f6]"
                            ],
                            "hover:text-[#3b82f6]"
                        )}
                    >
                        <Icon size={18} />
                        {view.label}
                    </button>
                );
            })}
        </div>
    );
}

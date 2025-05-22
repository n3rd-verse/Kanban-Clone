import { memo, useMemo } from "react";
import { TaskCard } from "./TaskCard";
import { cn } from "@/lib/utils";
import type { Task } from "@/types/task";
import type { useColumnVirtualizer } from "@/hooks/virtualizer";
import { useIntersectionObserver } from "@/hooks/core/use-intersection-observer";
import { extractIdPrefix } from "../utils/helpers";
import { AnimatePresence, motion } from "framer-motion";

interface VirtualizedTaskListProps {
    tasks: Task[];
    virtualizer: ReturnType<typeof useColumnVirtualizer>;
    isDesktop: boolean;
    loadMoreRef: React.RefObject<HTMLDivElement>;
    hasNextPage: boolean;
    isFetchingNextPage: boolean;
    fetchNextPage: () => void;
    isCollapsed?: boolean;
}

export const VirtualizedTaskList = memo(function VirtualizedTaskList({
    tasks,
    virtualizer,
    isDesktop,
    loadMoreRef,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
    isCollapsed
}: VirtualizedTaskListProps) {
    useIntersectionObserver({
        target: loadMoreRef,
        onIntersect: fetchNextPage,
        enabled: hasNextPage && !isFetchingNextPage
    });

    // Group tasks by prefix for visual adjacency
    const groupedTasks = useMemo(() => {
        const result: { prefix: string | null; tasks: Task[] }[] = [];
        let currentPrefix: string | null = null;
        let currentGroup: Task[] = [];
        for (const task of tasks) {
            const prefix = extractIdPrefix(task.id);
            if (prefix !== currentPrefix) {
                if (currentGroup.length > 0) {
                    result.push({ prefix: currentPrefix, tasks: currentGroup });
                }
                currentPrefix = prefix;
                currentGroup = [task];
            } else {
                currentGroup.push(task);
            }
        }
        if (currentGroup.length > 0) {
            result.push({ prefix: currentPrefix, tasks: currentGroup });
        }
        return result;
    }, [tasks]);

    const containerStyle = isDesktop
        ? { height: "auto" }
        : {
              height: `${virtualizer.getTotalSize()}px`,
              position: "relative" as const
          };

    return (
        <div className="relative w-full" style={containerStyle}>
            <AnimatePresence initial={false}>
                {!isCollapsed &&
                    groupedTasks.map((group, groupIdx) =>
                        group.tasks.map((task, idx) => {
                            const isGrouped =
                                group.prefix && group.tasks.length > 1;
                            const groupMargin =
                                groupIdx > 0 && idx === 0 ? "mt-6" : "";
                            const className = cn(
                                "w-full",
                                isDesktop ? "relative" : "relative",
                                isGrouped &&
                                    "border-l-4 border-blue-400 bg-blue-50/30",
                                groupMargin
                            );
                            return (
                                <motion.div
                                    key={task.id}
                                    className={className}
                                    style={isGrouped ? { marginBottom: 0 } : {}}
                                    initial={{ height: 0, opacity: 0, y: -20 }}
                                    animate={{
                                        height: "auto",
                                        opacity: 1,
                                        y: 0
                                    }}
                                    exit={{ height: 0, opacity: 0, y: -20 }}
                                    transition={{
                                        duration: 0.3,
                                        ease: "easeInOut"
                                    }}
                                >
                                    <TaskCard
                                        task={task}
                                        className="h-full break-words"
                                    />
                                </motion.div>
                            );
                        })
                    )}
            </AnimatePresence>
        </div>
    );
});

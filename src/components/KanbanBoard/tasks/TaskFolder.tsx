import {
    useState,
    memo,
    useCallback,
    useRef,
    useImperativeHandle,
    forwardRef,
    useEffect
} from "react";
import { Task } from "@/types/task";
import { TaskCard } from "./TaskCard";
import { Card } from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";
import { FolderIcon, ChevronDownIcon, ChevronRightIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useSelectionStore } from "@/stores/selection-store";

interface TaskFolderProps {
    tasks: Task[];
    folderName: string;
    className?: string;
}

/**
 * Interface for TaskFolder ref methods
 * Allows parent components to control folder open/close state
 */
export interface TaskFolderRef {
    isOpen: boolean;
    openFolder: () => void;
    closeFolder: () => void;
    toggleFolder: () => void;
}

const ANIMATION_DURATION = 0.1; // seconds
const ANIMATION_TIMEOUT = ANIMATION_DURATION * 1000 + 50; // ms + buffer

const ANIMATION_CONFIG = {
    initial: { opacity: 0, height: 0 },
    animate: {
        opacity: 1,
        height: "auto",
        transition: {
            duration: ANIMATION_DURATION,
            ease: "easeInOut"
        }
    },
    exit: {
        opacity: 0,
        height: 0,
        transition: {
            duration: ANIMATION_DURATION,
            ease: "easeInOut"
        }
    }
};

/**
 * Renders the header part of a task folder with folder name and controls
 */
const FolderHeader = memo(function FolderHeader({
    folderName,
    taskCount,
    isOpen,
    firstTaskTitle,
    onClick,
    onKeyDown,
    className,
    folderPrefix
}: {
    folderName: string;
    taskCount: number;
    isOpen: boolean;
    firstTaskTitle: string;
    onClick: () => void;
    onKeyDown: (e: React.KeyboardEvent) => void;
    className?: string;
    folderPrefix: string;
}) {
    return (
        <Card
            className={cn(
                "p-4 cursor-pointer transition-shadow duration-200",
                "hover:shadow-md hover:bg-gray-50 dark:hover:bg-gray-800",
                isOpen && "mb-2 shadow-md bg-gray-50 dark:bg-gray-800",
                className
            )}
            onClick={onClick}
            onKeyDown={onKeyDown}
            tabIndex={0}
            role="button"
            aria-expanded={isOpen}
            aria-controls={`folder-content-${folderName}`}
            data-testid={`folder-${folderPrefix}`}
            data-folder-header={folderPrefix}
        >
            <div className="flex items-center gap-2">
                <div className="flex-shrink-0 text-blue-500">
                    <FolderIcon size={20} />
                </div>

                <div className="flex-1 font-medium truncate">{folderName}</div>

                <div className="flex items-center gap-2">
                    <span
                        className="text-gray-500 text-sm"
                        aria-label={`${taskCount} tasks`}
                    >
                        ({taskCount})
                    </span>
                    {isOpen ? (
                        <ChevronDownIcon size={16} aria-hidden="true" />
                    ) : (
                        <ChevronRightIcon size={16} aria-hidden="true" />
                    )}
                </div>
            </div>

            {/* Show first task title as folder description */}
            <div className="mt-1 text-gray-500 text-sm truncate">
                {firstTaskTitle}
            </div>
        </Card>
    );
});

/**
 * Renders a list of tasks inside a folder
 */
const TaskList = memo(function TaskList({
    tasks,
    folderPrefix
}: {
    tasks: Task[];
    folderPrefix: string;
}) {
    return (
        <>
            {tasks.map((task, index) => (
                <div
                    className="mb-3 px-1 py-1"
                    key={task.id}
                    data-folder-item
                    data-folder-prefix={folderPrefix}
                    data-folder-item-index={index}
                >
                    <TaskCard
                        task={task}
                        className="z-10 relative h-full break-words"
                    />
                </div>
            ))}
        </>
    );
});

/**
 * TaskFolder component that groups related tasks together
 * Provides collapsible UI for task organization with animation
 *
 * @param props - Component props
 * @param ref - Forwarded ref for controlling folder from parent
 */
export const TaskFolder = memo(
    forwardRef<TaskFolderRef, TaskFolderProps>(function TaskFolder(
        { tasks, folderName, className },
        ref
    ) {
        const [isOpen, setIsOpen] = useState(false);
        const folderRef = useRef<HTMLDivElement>(null);
        const animationTimeoutRef = useRef<NodeJS.Timeout | null>(null);
        const setAnimating = useSelectionStore((state) => state.setAnimating);

        // Extract folder metadata
        const firstTask = tasks[0];
        const taskCount = tasks.length;
        const folderPrefix = folderName.replace(/[\[\]]/g, "");

        // Expose methods to parent components via ref
        useImperativeHandle(ref, () => ({
            isOpen,
            openFolder: () => handleFolderOpen(true),
            closeFolder: () => handleFolderOpen(false),
            toggleFolder: () => handleFolderOpen(!isOpen)
        }));

        // Unified folder open/close handler
        const handleFolderOpen = useCallback(
            (shouldOpen: boolean) => {
                // Block UI during animation
                setAnimating(true);

                // Clear any existing timeout
                if (animationTimeoutRef.current) {
                    clearTimeout(animationTimeoutRef.current);
                }

                // Update folder state
                setIsOpen(shouldOpen);

                // Unblock UI after animation completes
                animationTimeoutRef.current = setTimeout(() => {
                    setAnimating(false);
                }, ANIMATION_TIMEOUT);
            },
            [setAnimating]
        );

        // Toggle handler - preserved for readability
        const toggleFolder = useCallback(() => {
            handleFolderOpen(!isOpen);
        }, [handleFolderOpen, isOpen]);

        // Keyboard accessibility
        const handleKeyDown = useCallback(
            (e: React.KeyboardEvent) => {
                if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    toggleFolder();
                }
            },
            [toggleFolder]
        );

        // Clean up timeout on unmount
        useEffect(() => {
            return () => {
                if (animationTimeoutRef.current) {
                    clearTimeout(animationTimeoutRef.current);
                    setAnimating(false);
                }
            };
        }, [setAnimating]);

        return (
            <div
                className="mb-4 task-folder"
                ref={folderRef}
                data-folder-id={folderPrefix}
                style={{ paddingBottom: "4px" }}
            >
                {/* Folder Header */}
                <FolderHeader
                    folderName={folderName}
                    taskCount={taskCount}
                    isOpen={isOpen}
                    firstTaskTitle={firstTask.title}
                    onClick={toggleFolder}
                    onKeyDown={handleKeyDown}
                    className={className}
                    folderPrefix={folderPrefix}
                />

                {/* Expandable Task List */}
                <AnimatePresence>
                    {isOpen && (
                        <motion.div
                            id={`folder-content-${folderName}`}
                            {...ANIMATION_CONFIG}
                            className="ml-2 pl-4 border-blue-200 border-l-2 overflow-visible"
                            data-folder-content={folderPrefix}
                        >
                            <TaskList
                                tasks={tasks}
                                folderPrefix={folderPrefix}
                            />
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        );
    })
);

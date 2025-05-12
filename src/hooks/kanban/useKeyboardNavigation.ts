import { useEffect, RefObject, useRef, useCallback } from "react";
import { TaskStatus } from "@/constants/task-status";
import { STATUS_CONFIG } from "@/components/KanbanBoard/utils/constants";
import { useSelectionStore, findTaskPosition } from "@/stores/selection-store";
import { useKeyboard } from "@react-aria/interactions";
import { extractIdPrefix } from "@/components/KanbanBoard/utils/helpers";

// Add debug flag - can be set to false in production
const DEBUG_KEYBOARD_NAVIGATION = true;

// Debug logging function
const logNavigationDebug = (message: string, ...data: any[]) => {
    if (DEBUG_KEYBOARD_NAVIGATION) {
        console.log(`[KeyboardNav] ${message}`, ...data);
    }
};

type KeyboardNavOptions = {
    containerRef?: RefObject<HTMLElement>;
    enableFocus?: boolean;
    enableScrollIntoView?: boolean;
};

/**
 * Enhanced keyboard navigation hook that uses React Aria for improved accessibility
 *
 * This hook provides keyboard navigation between task cards in a Kanban board
 * and integrates with the selection store for state management.
 */
export function useKeyboardNavigation(options: KeyboardNavOptions = {}) {
    const {
        containerRef,
        enableFocus = true,
        enableScrollIntoView = true
    } = options;

    const { selectedTaskId, tasksByStatus, selectTask, isAnimating } =
        useSelectionStore();
    const lastKeyPressRef = useRef<string | null>(null);
    const isNavigatingRef = useRef<boolean>(false);
    const previousTaskIdRef = useRef<string | undefined>(selectedTaskId);

    // Focus and scroll the selected task card into view
    const focusTaskCard = useCallback(
        (taskId: string) => {
            if (!enableFocus) return;

            // Use requestAnimationFrame to ensure DOM is updated before focusing
            requestAnimationFrame(() => {
                const element = document.querySelector(
                    `[data-testid="task-card-${taskId}"]`
                );

                if (element && element instanceof HTMLElement) {
                    // Focus the element
                    element.focus();

                    // Scroll into view if enabled
                    if (enableScrollIntoView) {
                        element.scrollIntoView({
                            behavior: "smooth",
                            block: "nearest"
                        });
                    }
                }
            });
        },
        [enableFocus, enableScrollIntoView]
    );

    // Check if a task is in a folder and handle folder opening
    const handleTaskInFolder = useCallback(
        (taskId: string, callback: () => void) => {
            // Extract the prefix from the task ID
            const prefix = extractIdPrefix(taskId);
            if (!prefix) {
                // Task is not in a folder, proceed with normal navigation
                callback();
                return;
            }

            // Find the folder element for this prefix
            const folderHeader = document.querySelector(
                `[data-folder-header="${prefix}"]`
            );
            const folderContent = document.querySelector(
                `[data-folder-content="${prefix}"]`
            );

            // Check if folder exists and is currently closed (content not visible)
            if (folderHeader && !folderContent) {
                // Folder is closed, need to open it first
                const folderElement = document.querySelector(
                    `[data-folder-id="${prefix}"]`
                );
                if (folderElement) {
                    // Simulate a click to open the folder
                    (folderHeader as HTMLElement).click();

                    // Wait for the animation to complete before focusing the task
                    setTimeout(() => {
                        callback();
                        // Focus the specific task
                        focusTaskCard(taskId);
                    }, 350); // Slightly longer than the animation duration (0.3s)
                    return;
                }
            }

            // If folder is already open or task is not in a folder, just proceed
            callback();
        },
        [focusTaskCard]
    );

    // React Aria keyboard handler
    const { keyboardProps } = useKeyboard({
        onKeyDown: (e: React.KeyboardEvent) => {
            const key = e.key;

            // Only handle arrow keys
            if (
                !["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(
                    key
                )
            ) {
                return;
            }

            // Check if animation is in progress
            if (isAnimating) {
                e.preventDefault();
                e.stopPropagation();
                return; // Don't process keyboard events during animations
            }

            // Prevent default behavior like scrolling
            e.preventDefault();
            e.stopPropagation();

            // Store last key pressed for double-press detection
            lastKeyPressRef.current = key;

            // Set navigating flag to true to prevent double selections
            isNavigatingRef.current = true;

            // Process navigation
            handleArrowNavigation(key);

            // Reset navigating flag after a short delay
            setTimeout(() => {
                isNavigatingRef.current = false;
            }, 50);
        }
    });

    // Find the next non-empty column in a specific direction
    const findNextNonEmptyColumn = useCallback(
        (currentStatusIndex: number, direction: "left" | "right") => {
            const statuses = STATUS_CONFIG.map((config) => config.id);

            // Determine the range of indices to check based on direction
            let startIndex, endIndex, step;

            if (direction === "left") {
                startIndex = currentStatusIndex - 1;
                endIndex = -1;
                step = -1;
            } else {
                // right
                startIndex = currentStatusIndex + 1;
                endIndex = statuses.length;
                step = 1;
            }

            // Check each column in the specified direction
            for (
                let i = startIndex;
                direction === "left" ? i > endIndex : i < endIndex;
                i += step
            ) {
                const status = statuses[i];
                const tasksInColumn = tasksByStatus[status] || [];

                if (tasksInColumn.length > 0) {
                    return {
                        status,
                        tasks: tasksInColumn
                    };
                }
            }

            // No non-empty column found
            return null;
        },
        [tasksByStatus]
    );

    // Function to handle navigation based on arrow key direction - memoized for stability
    const handleArrowNavigation = useCallback(
        (key: string) => {
            // Log the navigation attempt with current state
            logNavigationDebug(
                `Navigation with ${key}, isAnimating: ${isAnimating}, current selection: ${selectedTaskId}`
            );

            // If animation is in progress, don't proceed with navigation
            if (isAnimating) {
                logNavigationDebug(
                    `Navigation blocked due to animation in progress`
                );
                return;
            }

            // If no task is selected, select the first available task
            if (!selectedTaskId) {
                for (const status of Object.values(TaskStatus)) {
                    const tasks = tasksByStatus[status] || [];
                    if (tasks.length > 0) {
                        selectTask(tasks[0].id);
                        focusTaskCard(tasks[0].id);
                        return;
                    }
                }
                return;
            }

            // Find the position of the currently selected task
            const position = findTaskPosition(selectedTaskId, tasksByStatus);
            if (!position) return;

            const { status, index } = position;
            let nextTaskId: string | undefined;

            // Handle navigation based on arrow key
            switch (key) {
                case "ArrowUp":
                    if (index > 0) {
                        const tasks = tasksByStatus[status] || [];
                        nextTaskId = tasks[index - 1].id;

                        handleTaskInFolder(nextTaskId, () => {
                            selectTask(nextTaskId!);
                            focusTaskCard(nextTaskId!);
                        });
                    }
                    break;

                case "ArrowDown":
                    const tasks = tasksByStatus[status] || [];
                    if (index < tasks.length - 1) {
                        nextTaskId = tasks[index + 1].id;

                        handleTaskInFolder(nextTaskId, () => {
                            selectTask(nextTaskId!);
                            focusTaskCard(nextTaskId!);
                        });
                    }
                    break;

                case "ArrowLeft": {
                    // Get all column statuses in order
                    const statuses = STATUS_CONFIG.map((config) => config.id);
                    const statusIndex = statuses.indexOf(status);

                    if (statusIndex > 0) {
                        // Try to find the next non-empty column to the left
                        const nextColumn = findNextNonEmptyColumn(
                            statusIndex,
                            "left"
                        );

                        if (nextColumn) {
                            // Try to maintain same index, or use last item
                            const targetIndex = Math.min(
                                index,
                                nextColumn.tasks.length - 1
                            );
                            nextTaskId = nextColumn.tasks[targetIndex].id;

                            handleTaskInFolder(nextTaskId, () => {
                                selectTask(nextTaskId!);
                                focusTaskCard(nextTaskId!);
                            });
                        }
                    }
                    break;
                }

                case "ArrowRight": {
                    // Get all column statuses in order
                    const statuses = STATUS_CONFIG.map((config) => config.id);
                    const statusIndex = statuses.indexOf(status);

                    if (statusIndex < statuses.length - 1) {
                        // Try to find the next non-empty column to the right
                        const nextColumn = findNextNonEmptyColumn(
                            statusIndex,
                            "right"
                        );

                        if (nextColumn) {
                            // Try to maintain same index, or use last item
                            const targetIndex = Math.min(
                                index,
                                nextColumn.tasks.length - 1
                            );
                            nextTaskId = nextColumn.tasks[targetIndex].id;

                            handleTaskInFolder(nextTaskId, () => {
                                selectTask(nextTaskId!);
                                focusTaskCard(nextTaskId!);
                            });
                        }
                    }
                    break;
                }
            }
        },
        [
            selectedTaskId,
            tasksByStatus,
            selectTask,
            focusTaskCard,
            findNextNonEmptyColumn,
            handleTaskInFolder,
            isAnimating
        ]
    );

    // Check if we need to close a folder when leaving it
    const checkFolderCloseNeeded = useCallback(
        (oldTaskId: string, newTaskId: string) => {
            const oldPrefix = extractIdPrefix(oldTaskId);
            const newPrefix = extractIdPrefix(newTaskId);

            // If we're moving from one folder to a different context (different folder or not in folder)
            if (oldPrefix && oldPrefix !== newPrefix) {
                // Find the folder element and simulate a click to close it
                const folderHeader = document.querySelector(
                    `[data-folder-header="${oldPrefix}"]`
                );
                if (
                    folderHeader &&
                    (folderHeader as HTMLElement).getAttribute(
                        "aria-expanded"
                    ) === "true"
                ) {
                    // Wait a bit to ensure the new task is focused first
                    setTimeout(() => {
                        (folderHeader as HTMLElement).click();
                    }, 500);
                }
            }
        },
        []
    );

    // Track task selection changes to handle folder closing
    useEffect(() => {
        if (
            previousTaskIdRef.current &&
            selectedTaskId &&
            previousTaskIdRef.current !== selectedTaskId
        ) {
            checkFolderCloseNeeded(previousTaskIdRef.current, selectedTaskId);
        }
        previousTaskIdRef.current = selectedTaskId;
    }, [selectedTaskId, checkFolderCloseNeeded]);

    // Add keyboard event listener to container or window
    useEffect(() => {
        const container = containerRef?.current || window;

        // Create manual keyboard handler for window/container level
        const handleKeyDown = (event: Event) => {
            // Type guard to ensure we're handling a keyboard event
            if (!(event instanceof KeyboardEvent)) return;

            // Avoid double-processing if we're already handling navigation
            if (isNavigatingRef.current) return;

            // Only handle arrow keys
            if (
                !["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(
                    event.key
                )
            ) {
                return;
            }

            // Check if animation is in progress
            if (isAnimating) {
                event.preventDefault();
                event.stopPropagation();
                return; // Don't process keyboard events during animations
            }

            // Prevent default behavior like scrolling
            event.preventDefault();
            event.stopPropagation();

            // Store last key pressed
            lastKeyPressRef.current = event.key;

            // Set navigating flag to true to prevent double selections
            isNavigatingRef.current = true;

            // Process navigation
            handleArrowNavigation(event.key);

            // Reset navigating flag after a short delay
            setTimeout(() => {
                isNavigatingRef.current = false;
            }, 50);
        };

        // Register event listener with capture phase
        container.addEventListener("keydown", handleKeyDown, { capture: true });

        return () => {
            container.removeEventListener("keydown", handleKeyDown, {
                capture: true
            });
        };
    }, [containerRef, handleArrowNavigation, isAnimating]);

    return {
        selectedTaskId,
        keyboardProps,
        lastKeyPress: lastKeyPressRef.current,
        isNavigating: isNavigatingRef.current
    };
}

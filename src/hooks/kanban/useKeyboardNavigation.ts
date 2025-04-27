import { useEffect, RefObject, useRef, useCallback } from "react";
import { TaskStatus } from "@/constants/task-status";
import { STATUS_CONFIG } from "@/components/KanbanBoard/utils/constants";
import { useSelectionStore, findTaskPosition } from "@/stores/selection-store";
import { useKeyboard } from "@react-aria/interactions";

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

    const { selectedTaskId, tasksByStatus, selectTask } = useSelectionStore();
    const lastKeyPressRef = useRef<string | null>(null);
    const isNavigatingRef = useRef<boolean>(false);

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
                    }
                    break;

                case "ArrowDown":
                    const tasks = tasksByStatus[status] || [];
                    if (index < tasks.length - 1) {
                        nextTaskId = tasks[index + 1].id;
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
                        }
                    }
                    break;
                }
            }

            // Update selection if we found a next task
            if (nextTaskId) {
                selectTask(nextTaskId);
                // Explicitly focus and scroll the task into view
                focusTaskCard(nextTaskId);
            }
        },
        [
            selectedTaskId,
            tasksByStatus,
            selectTask,
            focusTaskCard,
            findNextNonEmptyColumn
        ]
    );

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
    }, [containerRef, handleArrowNavigation]);

    return {
        selectedTaskId,
        keyboardProps,
        lastKeyPress: lastKeyPressRef.current,
        isNavigating: isNavigatingRef.current
    };
}

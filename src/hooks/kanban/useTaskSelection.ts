import { useState, useCallback, useMemo, useEffect } from "react";
import { TaskStatus } from "@/constants/task-status";
import { Task } from "@/types/task";
import { useKeyboardNavigation } from "./useKeyboardNavigation";

/**
 * Custom hook to manage task selection state and keyboard navigation
 *
 * @param tasks - Object containing tasks grouped by status
 * @returns Selection state and handlers
 */
export function useTaskSelection(tasks: Record<TaskStatus, Task[]>) {
    const [selectedTaskId, setSelectedTaskId] = useState<string | undefined>(
        undefined
    );

    // Group task IDs by status for keyboard navigation
    const taskIdsByStatus = useMemo(() => {
        const result: Record<TaskStatus, string[]> = {} as Record<
            TaskStatus,
            string[]
        >;

        Object.entries(tasks).forEach(([status, statusTasks]) => {
            result[status as TaskStatus] = statusTasks.map((task) => task.id);
        });

        return result;
    }, [tasks]);

    // Handle task selection
    const handleTaskSelect = useCallback((taskId: string) => {
        setSelectedTaskId((prevId) => (prevId === taskId ? undefined : taskId));
    }, []);

    // 키보드 핸들러를 직접 여기서 구현
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            // 방향키만 처리
            if (
                !["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(
                    event.key
                )
            ) {
                return;
            }

            // 이벤트 기본 동작 방지
            event.preventDefault();

            // 현재 선택된 태스크가 없으면 첫 번째 컬럼의 첫 번째 태스크 선택
            if (!selectedTaskId) {
                // 첫 번째 상태의 첫 번째 태스크 찾기
                for (const status of Object.values(TaskStatus)) {
                    const tasksInStatus = taskIdsByStatus[status];
                    if (tasksInStatus && tasksInStatus.length > 0) {
                        handleTaskSelect(tasksInStatus[0]);
                        return;
                    }
                }
                return;
            }

            // 현재 선택된 태스크의 위치 찾기
            let currentStatus: TaskStatus | null = null;
            let currentIndex = -1;

            for (const [status, taskIds] of Object.entries(taskIdsByStatus)) {
                const index = taskIds.indexOf(selectedTaskId);
                if (index !== -1) {
                    currentStatus = status as TaskStatus;
                    currentIndex = index;
                    break;
                }
            }

            if (!currentStatus || currentIndex === -1) {
                return;
            }

            // 키보드 방향에 따라 새 태스크 선택
            switch (event.key) {
                case "ArrowUp":
                    if (currentIndex > 0) {
                        const newTaskId =
                            taskIdsByStatus[currentStatus][currentIndex - 1];
                        handleTaskSelect(newTaskId);
                    }
                    break;

                case "ArrowDown":
                    if (
                        currentIndex <
                        taskIdsByStatus[currentStatus].length - 1
                    ) {
                        const newTaskId =
                            taskIdsByStatus[currentStatus][currentIndex + 1];
                        handleTaskSelect(newTaskId);
                    }
                    break;

                case "ArrowLeft": {
                    // 이전 컬럼으로 이동
                    const statuses = Object.values(TaskStatus);
                    const statusIndex = statuses.indexOf(currentStatus);
                    if (statusIndex > 0) {
                        const prevStatus = statuses[statusIndex - 1];
                        const prevTasks = taskIdsByStatus[prevStatus];
                        if (prevTasks && prevTasks.length > 0) {
                            // 가능한 같은 인덱스, 아니면 마지막 항목
                            const targetIndex = Math.min(
                                currentIndex,
                                prevTasks.length - 1
                            );
                            handleTaskSelect(prevTasks[targetIndex]);
                        }
                    }
                    break;
                }

                case "ArrowRight": {
                    // 다음 컬럼으로 이동
                    const statuses = Object.values(TaskStatus);
                    const statusIndex = statuses.indexOf(currentStatus);
                    if (statusIndex < statuses.length - 1) {
                        const nextStatus = statuses[statusIndex + 1];
                        const nextTasks = taskIdsByStatus[nextStatus];
                        if (nextTasks && nextTasks.length > 0) {
                            // 가능한 같은 인덱스, 아니면 마지막 항목
                            const targetIndex = Math.min(
                                currentIndex,
                                nextTasks.length - 1
                            );
                            handleTaskSelect(nextTasks[targetIndex]);
                        }
                    }
                    break;
                }
            }
        };

        // 이벤트 리스너 등록 (캡처 단계에서)
        window.addEventListener("keydown", handleKeyDown, { capture: true });

        return () => {
            window.removeEventListener("keydown", handleKeyDown, {
                capture: true
            });
        };
    }, [selectedTaskId, taskIdsByStatus, handleTaskSelect]);

    return {
        selectedTaskId,
        handleTaskSelect
    };
}

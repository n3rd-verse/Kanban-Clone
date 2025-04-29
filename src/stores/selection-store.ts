import { create } from "zustand";
import { TaskStatus } from "@/constants/task-status";
import { Task } from "@/types/task";

interface SelectionState {
    selectedTaskId: string | undefined;
    tasksByStatus: Record<TaskStatus, Task[]>;

    // 액션
    selectTask: (taskId: string) => void;
    clearSelection: () => void;
    updateTasksByStatus: (status: TaskStatus, tasks: Task[]) => void;
}

/**
 * 선택한 카드 상태를 관리하는 Zustand 스토어
 *
 * selectedTaskId: 현재 선택된 태스크 ID
 * tasksByStatus: 상태별 태스크 목록 (키보드 네비게이션에 사용)
 *
 * selectTask: 태스크 선택/해제
 * clearSelection: 선택 초기화
 * updateTasksByStatus: 특정 상태의 태스크 목록 업데이트
 */
export const useSelectionStore = create<SelectionState>((set) => ({
    selectedTaskId: undefined,
    tasksByStatus: {} as Record<TaskStatus, Task[]>,

    selectTask: (taskId: string) =>
        set((state) => ({
            selectedTaskId: state.selectedTaskId === taskId ? undefined : taskId
        })),

    clearSelection: () =>
        set(() => ({
            selectedTaskId: undefined
        })),

    updateTasksByStatus: (status: TaskStatus, tasks: Task[]) =>
        set((state) => ({
            tasksByStatus: {
                ...state.tasksByStatus,
                [status]: tasks
            }
        }))
}));

/**
 * 키보드 네비게이션을 위한 헬퍼 함수
 *
 * 현재 선택된 태스크의 위치를 찾습니다.
 * @returns { status, index } 또는 null (찾지 못한 경우)
 */
export function findTaskPosition(
    selectedTaskId: string | undefined,
    tasksByStatus: Record<TaskStatus, Task[]>
) {
    if (!selectedTaskId) return null;

    for (const [status, tasks] of Object.entries(tasksByStatus)) {
        const index = tasks.findIndex((task) => task.id === selectedTaskId);
        if (index !== -1) {
            return {
                status: status as TaskStatus,
                index
            };
        }
    }

    return null;
}

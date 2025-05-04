import { Task } from "@/types/task";

interface TaskGroup {
    tasks: Task[];
    prefix: string;
    count: number;
    position: number; // 폴더의 원래 위치 정보
}

// 확장된 Task 타입 정의
interface TaskWithIndex extends Task {
    _originalIndex?: number;
}

// 그룹화 타입 수정
interface GroupedTasks {
    [prefix: string]: TaskWithIndex[];
}

/**
 * Extracts the ID prefix from a task ID
 * @param id Task identifier
 * @returns The prefix segment or null if invalid
 */
export const extractIdPrefix = (id: string): string | null => {
    if (!id) return null;
    const segments = id.split("-");
    return segments.length > 1 ? segments[0] : null;
};

/**
 * Groups tasks by their ID prefix (part before the first hyphen)
 * E.g., "2222-1-0" and "2222-2-0" will be grouped under "2222"
 */
export function groupTasksByIdPrefix(tasks: Task[]): GroupedTasks {
    return tasks.reduce<GroupedTasks>((groups, task, index) => {
        const prefix = extractIdPrefix(task.id);

        // Skip if no prefix found or it's an empty string
        if (!prefix) return groups;

        // Initialize the group if it doesn't exist and add the task
        if (!groups[prefix]) {
            groups[prefix] = [];
        }

        // 태스크에 원래 인덱스 정보를 추가
        groups[prefix].push({
            ...task,
            _originalIndex: index // 원래 위치 정보를 기억
        });
        return groups;
    }, {});
}

/**
 * Determines which task groups should be displayed as folders
 * Only returns true if there are multiple tasks with the same prefix
 */
export function shouldShowAsFolder(tasks: Task[]): Record<string, boolean> {
    const groups = groupTasksByIdPrefix(tasks);

    return Object.entries(groups).reduce<Record<string, boolean>>(
        (result, [prefix, groupedTasks]) => {
            // Mark for folder view if there are multiple tasks with this prefix
            result[prefix] = groupedTasks.length > 1;
            return result;
        },
        {}
    );
}

/**
 * Creates an array of task groups for rendering in folder view
 * Only includes groups that should be displayed as folders
 * 폴더의 위치를 API 응답 순서에 맞게 결정
 */
export function createTaskFolders(tasks: Task[]): TaskGroup[] {
    const groups = groupTasksByIdPrefix(tasks);
    const shouldShow = shouldShowAsFolder(tasks);

    // 각 그룹의 첫 번째 태스크의 원래 인덱스를 기준으로 정렬
    return Object.entries(groups)
        .filter(([prefix]) => shouldShow[prefix])
        .map(([prefix, tasks]) => {
            // 원래 인덱스 정보 찾기 (첫 번째 태스크의 인덱스를 폴더 위치로 사용)
            const firstTaskIndex = Math.min(
                ...tasks.map((task) => task._originalIndex || 0)
            );

            // 원래 인덱스 정보 제거
            const cleanTasks = tasks.map((task) => {
                const { _originalIndex, ...cleanTask } = task;
                return cleanTask as Task;
            });

            return {
                prefix,
                tasks: cleanTasks,
                count: cleanTasks.length,
                position: firstTaskIndex // 폴더의 위치 정보 저장
            };
        })
        .sort((a, b) => a.position - b.position); // 원래 태스크 순서대로 정렬
}

/**
 * Filters tasks to only include those that should be rendered individually
 * (not in folders)
 */
export function getIndividualTasks(tasks: Task[]): Task[] {
    const shouldShow = shouldShowAsFolder(tasks);

    return tasks.filter((task) => {
        const prefix = extractIdPrefix(task.id);
        return !prefix || !shouldShow[prefix];
    });
}

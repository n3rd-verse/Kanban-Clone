import { memo, useMemo, useRef, createRef } from "react";
import { TaskCard } from "./TaskCard";
import { cn } from "@/lib/utils";
import type { Task } from "@/types/task";
import type { useColumnVirtualizer } from "@/hooks/virtualizer";
import { useIntersectionObserver } from "@/hooks/core/use-intersection-observer";
import { TaskFolder, TaskFolderRef } from "./TaskFolder";
import { createTaskFolders, getIndividualTasks } from "../utils/helpers";

interface VirtualizedTaskListProps {
    tasks: Task[];
    virtualizer: ReturnType<typeof useColumnVirtualizer>;
    isDesktop: boolean;
    loadMoreRef: React.RefObject<HTMLDivElement>;
    hasNextPage: boolean;
    isFetchingNextPage: boolean;
    fetchNextPage: () => void;
}

// 통합 항목 정의 (폴더 또는 태스크)
type ListItem =
    | { type: "folder"; id: string; position: number; folder: any }
    | { type: "task"; id: string; position: number; task: Task };

export const VirtualizedTaskList = memo(function VirtualizedTaskList({
    tasks,
    virtualizer,
    isDesktop,
    loadMoreRef,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage
}: VirtualizedTaskListProps) {
    // 폴더 ref 관리
    const folderRefs = useRef<Map<string, React.RefObject<TaskFolderRef>>>(
        new Map()
    );

    // 무한 스크롤 설정
    useIntersectionObserver({
        target: loadMoreRef,
        onIntersect: fetchNextPage,
        enabled: hasNextPage && !isFetchingNextPage
    });

    // 폴더와 개별 태스크 생성
    const folders = useMemo(() => createTaskFolders(tasks), [tasks]);
    const individualTasks = useMemo(() => getIndividualTasks(tasks), [tasks]);

    // 폴더 ref 설정
    useMemo(() => {
        const currentPrefixes = new Set(folders.map((folder) => folder.prefix));

        // 불필요한 ref 제거
        for (const prefix of folderRefs.current.keys()) {
            if (!currentPrefixes.has(prefix)) {
                folderRefs.current.delete(prefix);
            }
        }

        // 새 폴더 ref 추가
        folders.forEach((folder) => {
            if (!folderRefs.current.has(folder.prefix)) {
                folderRefs.current.set(
                    folder.prefix,
                    createRef() as React.RefObject<TaskFolderRef>
                );
            }
        });
    }, [folders]);

    // 모든 항목(폴더와 태스크)을 원래 순서대로 정렬
    const sortedItems = useMemo(() => {
        // 폴더 항목
        const folderItems: ListItem[] = folders.map((folder) => ({
            type: "folder",
            id: `folder-${folder.prefix}`,
            position: folder.position,
            folder
        }));

        // 개별 태스크 항목
        const taskItems: ListItem[] = individualTasks.map((task) => {
            // 원래 API 응답 순서 찾기
            const originalPosition = tasks.findIndex((t) => t.id === task.id);
            return {
                type: "task",
                id: task.id,
                position: originalPosition >= 0 ? originalPosition : 9999,
                task
            };
        });

        // 합치고 정렬
        return [...folderItems, ...taskItems].sort(
            (a, b) => a.position - b.position
        );
    }, [folders, individualTasks, tasks]);

    // 컨테이너 스타일
    const containerStyle = isDesktop
        ? { height: "auto" }
        : {
              height: `${virtualizer.getTotalSize()}px`,
              position: "relative" as const
          };

    return (
        <div className="relative w-full" style={containerStyle}>
            {sortedItems.map((item) => {
                if (item.type === "folder") {
                    // 폴더 렌더링
                    const folder = item.folder;
                    const folderRef = folderRefs.current.get(folder.prefix);

                    return (
                        <TaskFolder
                            key={`folder-${folder.prefix}`}
                            ref={folderRef}
                            folderName={`[${folder.prefix}]`}
                            tasks={folder.tasks}
                            className="mb-4"
                        />
                    );
                } else {
                    // 개별 태스크 렌더링
                    const task = item.task;
                    const className = cn(
                        "w-full",
                        isDesktop ? "relative mb-4" : "relative"
                    );

                    return (
                        <div key={task.id} className={className}>
                            <TaskCard
                                task={task}
                                className="h-full break-words"
                            />
                        </div>
                    );
                }
            })}
        </div>
    );
});

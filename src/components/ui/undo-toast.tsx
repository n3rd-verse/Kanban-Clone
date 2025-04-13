import React from "react";
import { toast as toastFn } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";

interface UndoToastProps {
    title?: string;
    description?: string;
    actionLabel?: string;
    onAction?: () => void;
}

export function showDeleteToast({
    title = "1 deleted",
    actionLabel = "Undo",
    onAction
}: UndoToastProps) {
    return toastFn({
        duration: 5000,
        className: cn(
            "bg-black text-white border-none p-4 flex items-center gap-4 rounded-lg",
            // 화면 아래 중앙에 배치하기 위한 스타일 오버라이드
            "fixed !bottom-4 !top-auto !left-1/2 !right-auto !-translate-x-1/2 !m-0 !max-w-sm"
        ),
        // @ts-ignore - The toast accepts ReactNode for title but TypeScript has incorrect typing
        title: (
            <div className="flex items-center gap-3">
                <div className="flex justify-center items-center rounded-full w-6 h-6">
                    <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <circle
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="white"
                            strokeWidth="2"
                        />
                        <path
                            d="M15 9L9 15M9 9L15 15"
                            stroke="white"
                            strokeWidth="2"
                            strokeLinecap="round"
                        />
                    </svg>
                </div>
                <span>{title}</span>
            </div>
        ),
        action: onAction ? (
            <button
                onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    onAction();
                }}
                className="font-medium text-blue-400 hover:text-blue-300 transition-colors"
            >
                {actionLabel}
            </button>
        ) : undefined
    });
}

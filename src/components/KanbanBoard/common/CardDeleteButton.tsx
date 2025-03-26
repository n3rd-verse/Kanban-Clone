import React from "react";
import trashIcon from "@/assets//icons/delete.svg";
import { cn } from "@/lib/utils";

interface DeleteButtonProps {
    onClick: () => void;
    className?: string;
    disabled?: boolean;
}

export function CardDeleteButton({
    onClick,
    className,
    disabled
}: DeleteButtonProps) {
    return (
        <button
            type="button"
            onClick={(e) => {
                e.stopPropagation();
                onClick();
            }}
            disabled={disabled}
            data-testid="delete-button"
            className={cn(
                "w-6 h-6 flex items-center justify-center",
                "text-gray-500 hover:text-red-500",
                "rounded-lg hover:bg-gray-100 transition-colors",
                disabled && "opacity-50 cursor-not-allowed"
            )}
        >
            {React.createElement("img", {
                src: trashIcon,
                alt: "Delete",
                className: "w-6 h-6"
            })}
        </button>
    );
}

import React from "react";
import trashIcon from "@/assets//icons/delete.svg";

interface DeleteButtonProps {
    onClick: () => void;
    className?: string;
}

export function CardDeleteButton({ onClick, className }: DeleteButtonProps) {
    return (
        <button
            type="button"
            className={`w-6 h-6 flex items-center justify-center text-gray-500 hover:text-red-500 rounded-lg hover:bg-gray-100 transition-colors ${className}`}
            onClick={(e) => {
                e.stopPropagation();
                onClick();
            }}
        >
            {React.createElement("img", {
                src: trashIcon,
                alt: "Delete",
                className: "w-6 h-6"
            })}
        </button>
    );
}

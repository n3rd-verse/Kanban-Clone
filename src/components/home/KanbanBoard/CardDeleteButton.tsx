import { Trash2 } from "lucide-react";

interface DeleteButtonProps {
    onClick: () => void;
    className?: string;
}

export function CardDeleteButton({ onClick, className }: DeleteButtonProps) {
    return (
        <button
            type="button"
            className={`w-10 h-10 flex items-center justify-center text-gray-500 hover:text-red-500 rounded-lg hover:bg-gray-100 transition-colors ${className}`}
            onClick={onClick}
        >
            <Trash2 size={28} />
        </button>
    );
}

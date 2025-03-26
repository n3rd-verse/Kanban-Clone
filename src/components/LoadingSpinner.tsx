import { cn } from "@/lib/utils";

interface LoadingSpinnerProps {
    className?: string;
    overlay?: boolean;
}

export function LoadingSpinner({
    className,
    overlay = false
}: LoadingSpinnerProps) {
    if (overlay) {
        return (
            <div className="z-10 absolute inset-0 flex justify-center items-center bg-white/50">
                <div className="border-2 border-t-transparent border-blue-500 rounded-full w-6 h-6 animate-spin" />
            </div>
        );
    }

    return (
        <div className={cn("flex justify-center p-4", className)}>
            <div className="border-primary border-b-2 rounded-full w-8 h-8 animate-spin" />
        </div>
    );
}

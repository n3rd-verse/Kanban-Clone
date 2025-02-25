import { cn } from "@/lib/utils";

interface LoadingSpinnerProps {
    className?: string;
}

export function LoadingSpinner({ className }: LoadingSpinnerProps) {
    return (
        <div className={cn("flex justify-center p-4", className)}>
            <div className="border-primary border-b-2 rounded-full w-8 h-8 animate-spin" />
        </div>
    );
}

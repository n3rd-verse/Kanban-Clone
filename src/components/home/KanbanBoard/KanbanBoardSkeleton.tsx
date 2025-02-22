import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export const TaskCardSkeleton = () => (
    <Card className="p-4">
        <div className="flex sm:flex-row flex-col justify-between items-start gap-4">
            <div className="flex-1 space-y-3">
                <Skeleton className="w-3/4 h-4" />
                <Skeleton className="w-1/4 h-3" />
                <Skeleton className="w-1/3 h-3" />
            </div>
            <Skeleton className="rounded w-4 h-4" />
        </div>
    </Card>
);

export const ColumnSkeleton = () => (
    <div className="flex flex-col gap-4">
        <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
                <Skeleton className="rounded-lg w-16 h-7" />
                <Skeleton className="rounded-full w-5 h-5" />
            </div>
        </div>
        <div className="space-y-4">
            {[1, 2, 3].map((i) => (
                <TaskCardSkeleton key={i} />
            ))}
        </div>
    </div>
);

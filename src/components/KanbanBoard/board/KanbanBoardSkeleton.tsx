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
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => (
                <TaskCardSkeleton key={i} />
            ))}
        </div>
    </div>
);

export const ScheduleColumnSkeleton = () => (
    <div className="ml-4 pt-6 md:pt-0 md:pl-6 border-gray-200 border-t md:border-t-0 md:border-l">
        <div className="space-y-8">
            {[1, 2, 3].map((i) => (
                <div key={i} className="space-y-4">
                    <Skeleton className="w-32 h-6" />
                    <div className="space-y-4">
                        {[1, 2].map((j) => (
                            <Card key={j} className="space-y-3 p-4">
                                <Skeleton className="w-24 h-4" />
                                <Skeleton className="w-48 h-4" />
                                <Skeleton className="w-32 h-3" />
                            </Card>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    </div>
);

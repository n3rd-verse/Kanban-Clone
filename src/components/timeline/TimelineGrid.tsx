import { isWeekend } from "date-fns";
import { cn } from "@/lib/utils";

interface TimelineGridProps {
    dates: Date[];
    dayColumnWidth: number;
    rowCount?: number;
}

export function TimelineGrid({
    dates,
    dayColumnWidth,
    rowCount = 4
}: TimelineGridProps) {
    // 행 번호 생성 (1부터 rowCount까지)
    const rows = Array.from({ length: rowCount }, (_, i) => i + 1);

    return (
        <div className="flex flex-col gap-0">
            {rows.map((row) => (
                <div key={row} className="flex">
                    {dates.map((date) => {
                        const isWeekendDay = isWeekend(date);

                        return (
                            <div
                                key={date.toISOString()}
                                style={{
                                    width: `${dayColumnWidth}px`,
                                    minWidth: `${dayColumnWidth}px`,
                                    scrollSnapAlign: "start"
                                }}
                                className={cn(
                                    "h-[150px]",
                                    isWeekendDay && "bg-[#F7F7F7]"
                                )}
                            />
                        );
                    })}
                </div>
            ))}
        </div>
    );
}

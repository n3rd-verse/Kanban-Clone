import { TimelineHeader } from "./TimelineHeader";

interface TimelineHeaderRowProps {
    dates: Date[];
    dayColumnWidth: number;
}

export function TimelineHeaderRow({
    dates,
    dayColumnWidth
}: TimelineHeaderRowProps) {
    return (
        <div className="relative">
            <div className="top-[50%] right-0 left-0 absolute h-[2px]">
                <div className="relative w-full">
                    <div className="absolute inset-0 bg-red-500" />
                </div>
            </div>
            <div className="flex">
                {dates.map((date) => (
                    <TimelineHeader
                        key={date.toISOString()}
                        date={date}
                        width={dayColumnWidth}
                    />
                ))}
            </div>
        </div>
    );
}

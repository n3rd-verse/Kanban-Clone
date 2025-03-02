import { format, isWeekend } from "date-fns";
import { ko } from "date-fns/locale";
import { TimelineHeader } from "./TimelineHeader";
import { useResponsiveLayout } from "@/hooks/design/use-responsive-layout";
import { cn } from "@/lib/utils";

export function Timeline() {
    const { width } = useResponsiveLayout();

    return (
        <div className="bg-white p-6 min-h-screen">
            <div className="mb-8">
                <h2 className="font-semibold text-2xl">
                    {format(new Date(), "MMMM yyyy")}
                </h2>
            </div>
            <div className="relative mb-8">
                <div className="top-[50%] right-0 left-0 absolute h-[2px]">
                    <div className="relative w-full">
                        <div className="absolute inset-0 bg-red-500" />
                    </div>
                </div>
                <div className="flex">
                    {[
                        9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22
                    ].map((day) => (
                        <TimelineHeader
                            key={day}
                            date={new Date(2024, 1, day)}
                        />
                    ))}
                </div>
            </div>
            {/* 보드 영역 */}
            <div className="flex flex-col gap-0">
                {[1, 2, 3, 4].map((row) => (
                    <div key={row} className="flex">
                        {[
                            9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21,
                            22
                        ].map((day) => {
                            const date = new Date(2024, 1, day);
                            const isWeekendDay = isWeekend(date);

                            return (
                                <div
                                    key={day}
                                    className={cn(
                                        "flex-1 h-[150px]",
                                        isWeekendDay && "bg-[#F7F7F7]"
                                    )}
                                />
                            );
                        })}
                    </div>
                ))}
            </div>
        </div>
    );
}

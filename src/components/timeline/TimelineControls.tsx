import { ChevronLeft, ChevronRight } from "lucide-react";
import { format } from "date-fns";
import { ko } from "date-fns/locale";

interface TimelineControlsProps {
    scrollLeft: () => void;
    scrollRight: () => void;
    currentDate?: Date;
}

export function TimelineControls({
    scrollLeft,
    scrollRight,
    currentDate = new Date()
}: TimelineControlsProps) {
    return (
        <div className="flex justify-between items-center">
            <h2 className="font-semibold text-2xl">
                {format(currentDate, "yyyy년 MMMM", { locale: ko })}
            </h2>
            <div className="flex items-center gap-2">
                <button
                    onClick={scrollLeft}
                    className="bg-white hover:bg-gray-100 p-2 border rounded-full"
                    aria-label="Scroll left"
                >
                    <ChevronLeft size={20} />
                </button>
                <button
                    onClick={scrollRight}
                    className="bg-white hover:bg-gray-100 p-2 border rounded-full"
                    aria-label="Scroll right"
                >
                    <ChevronRight size={20} />
                </button>
            </div>
        </div>
    );
}

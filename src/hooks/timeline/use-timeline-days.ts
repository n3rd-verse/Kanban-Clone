import { useMemo } from "react";

interface UseTimelineDaysProps {
    year?: number;
    month?: number; // 0-11 (JavaScript Date 객체 기준)
    startDay?: number;
}

interface UseTimelineDaysReturn {
    days: number[];
    dates: Date[];
    monthName: string;
    year: number;
}

/**
 * Generates timeline data: days numbers, date objects, month name, and year.
 * @param options.year - The calendar year (default: current year).
 * @param options.month - The calendar month (0-11, default: current month).
 * @param options.startDay - Starting day-of-month (default: 1).
 * @returns Object containing:
 *   - days: Array of day numbers in the month.
 *   - dates: Corresponding Date objects for each day.
 *   - monthName: Full month name (e.g., "January").
 *   - year: The year used for calculations.
 */
export function useTimelineDays({
    year = new Date().getFullYear(),
    month = new Date().getMonth(),
    startDay = 1
}: UseTimelineDaysProps = {}): UseTimelineDaysReturn {
    // 해당 월의 마지막 날 계산
    const endDay = useMemo(() => {
        // 다음 달의 0일은 현재 달의 마지막 날
        return new Date(year, month + 1, 0).getDate();
    }, [year, month]);

    const days = useMemo(() => {
        return Array.from(
            { length: endDay - startDay + 1 },
            (_, i) => i + startDay
        );
    }, [startDay, endDay]);

    const dates = useMemo(() => {
        return days.map((day) => new Date(year, month, day));
    }, [days, year, month]);

    const monthName = useMemo(() => {
        return new Date(year, month, 1).toLocaleString("en-US", {
            month: "long"
        });
    }, [year, month]);

    return useMemo(
        () => ({
            days,
            dates,
            monthName,
            year
        }),
        [days, dates, monthName, year]
    );
}

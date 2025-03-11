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
 * 타임라인 날짜 데이터를 생성하는 훅
 * 현재 날짜 또는 지정된 연도/월의 모든 날짜를 생성합니다.
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

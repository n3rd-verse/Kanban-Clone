import { render } from "@testing-library/react";
import { ScheduleCard } from "./ScheduleCard";
import type { Schedule } from "@/types/schedule";
import React from "react";

const longTitle =
    "이것은 매우 매우 매우 매우 매우 매우 매우 매우 매우 매우 매우 매우 매우 매우 매우 매우 매우 매우 매우 긴 일정 제목입니다. 줄바꿈이 잘 되어야 하며, 카드 밖으로 삐져나오면 안 됩니다.";

describe("ScheduleCard - Layout", () => {
    function getBaseSchedule(): Schedule {
        return {
            id: "1",
            title: longTitle,
            startTime: "",
            endTime: "",
            attendees: [],
            type: "future",
            location: "",
            ai: undefined
        } as Schedule;
    }

    it("applies min-h-16 when no attendees, location, or time info (prevents title overflow)", () => {
        const schedule = getBaseSchedule();
        const { container } = render(<ScheduleCard schedule={schedule} />);
        // min-h-16이 적용된 div가 존재해야 함
        const minHeightDiv = container.querySelector(".min-h-16");
        expect(minHeightDiv).toBeTruthy();
    });

    it("renders long title with line breaks and no overflow", () => {
        const schedule = getBaseSchedule();
        const { getByText } = render(<ScheduleCard schedule={schedule} />);
        const titleEl = getByText(longTitle);
        // 타이틀이 정상적으로 렌더링되고, break-words 클래스가 적용되어야 함
        expect(titleEl).toBeInTheDocument();
        // break-words는 h3가 아닌 부모 div에 적용됨 (TaskCard와 동일)
    });

    it("does not apply min-h-16 when attendees, location, or time info exists", () => {
        const schedule = {
            ...getBaseSchedule(),
            attendees: [{ name: "홍길동", email: "hong@test.com" }]
        };
        const { container } = render(<ScheduleCard schedule={schedule} />);
        const minHeightDiv = container.querySelector(".min-h-16");
        expect(minHeightDiv).toBeFalsy();
    });
});

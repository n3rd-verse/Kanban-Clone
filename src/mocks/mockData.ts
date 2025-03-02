import type { Task } from "@/types/task";
import type { ScheduleDay } from "@/types/schedule";

// 각 상태별 50개의 태스크를 생성하는 헬퍼 함수
const generateTasksForStatus = (
    status: Task["status"],
    count: number
): Task[] => {
    return Array.from({ length: count }, (_, index) => ({
        id: `${status}-${index + 1}`,
        title:
            status === "in_progress"
                ? `${status.toUpperCase()} Task ${index + 1} - 2025년 1월 입퇴사자 정보(입사일자/퇴사일자, 퇴사사유) 및 일용근로소득, 사업소득, 기타소득 지급 여부 확인 및 Safebox 신규 Service ID 발급 요청 회신`
                : `${status.toUpperCase()} Task ${index + 1} - ${
                      index % 3 === 0
                          ? "Safebox 신규 Service ID 발급 요청"
                          : index % 3 === 1
                            ? "2025년 1월분 급여자료 회신 요청"
                            : "면접 가능 여부 회신 요청"
                  }`,
        assignee:
            index % 2 === 0
                ? ["김태훈", "임희정"]
                : index % 3 === 0
                  ? ["예인세무회계"]
                  : ["Seokmin Lee", "Heemang Lee"],
        date: new Date(2024, 1, Math.floor(index / 10) + 1).toISOString(),
        status: status,
        completed: status === "completed"
    }));
};

// 각 상태별로 50개씩 태스크 생성
export const mockTasks: Task[] = [
    ...generateTasksForStatus("new", 50),
    ...generateTasksForStatus("in_progress", 50),
    ...generateTasksForStatus("urgent", 50),
    ...generateTasksForStatus("completed", 50)
];

export const mockScheduleDays: ScheduleDay[] = [
    {
        id: "date-1",
        date: new Date(2024, 0, 31), // 31 JAN
        schedules: [
            {
                id: "1",
                title: "Daily Scrum",
                startTime: "9:00 AM",
                endTime: "9:30 AM",
                type: "daily"
            },
            {
                id: "2",
                title: "OfficeMail Desktop Calendar Kickoff Meeting",
                startTime: "10:00 AM",
                endTime: "11:00 AM",
                type: "meeting",
                location: "Jiran 37"
            }
        ]
    },
    {
        id: "date-2",
        date: new Date(2024, 1, 10), // 10 FRI (Yesterday)
        schedules: [
            {
                id: "3",
                title: "OfficeMail AI Marketing Meeting",
                startTime: "10:00 AM",
                endTime: "11:00 AM",
                type: "meeting",
                location:
                    "FASTFIVE 7F 704, Hakdong-ro 45-gil 3, Gangam-gu Seoul"
            }
        ]
    },
    {
        id: "date-3",
        date: new Date(2024, 1, 11), // 11 SAT (Today)
        schedules: [
            {
                id: "1",
                title: "Daily Scrum",
                startTime: "9:00 AM",
                endTime: "9:30 AM",
                type: "daily"
            },
            {
                id: "3",
                title: "OfficeMail AI Marketing Meeting",
                startTime: "10:00 AM",
                endTime: "11:00 AM",
                type: "meeting",
                location:
                    "FASTFIVE 7F 704, Hakdong-ro 45-gil 3, Gangam-gu Seoul"
            }
        ]
    }
];

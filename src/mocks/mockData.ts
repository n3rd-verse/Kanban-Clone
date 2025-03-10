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
    // Requested (New) 컬럼
    {
        id: "new-1",
        title: "Simply dummy text of the printing and typesetting industry.",
        assignee: ["김태호", "임지영"],
        date: new Date(2025, 1, 24).toISOString(),
        status: "new"
    },

    // In Progress 컬럼
    {
        id: "in_progress-1",
        title: "Simply dummy text of the printing and typesetting industry.",
        assignee: ["김태호"],
        date: new Date(2025, 1, 24).toISOString(),
        status: "in_progress"
    },

    // Overdue (Urgent) 컬럼
    {
        id: "urgent-1",
        title: "2025년 1월분 급여자료 회신 요청",
        assignee: ["예인세무회계"],
        date: new Date(2025, 1, 4).toISOString(),
        status: "urgent"
    },
    {
        id: "urgent-2",
        title: "2025년 1월 입퇴사자 정보(인사/급여, 퇴직사유) 회신 요청",
        assignee: ["예인세무회계"],
        date: new Date(2025, 1, 4).toISOString(),
        status: "urgent"
    },
    {
        id: "urgent-3",
        title: "2025년 1월 일용근로소득, 사업소득, 기타소득 지급 여부 확인 요청",
        assignee: ["예인세무회계"],
        date: new Date(2025, 1, 4).toISOString(),
        status: "urgent"
    },

    // Completed 컬럼
    {
        id: "completed-1",
        title: "명함 정보 확인 요청",
        assignee: ["Juno Kwaan"],
        date: new Date(2025, 1, 1).toISOString(),
        status: "completed"
    },
    {
        id: "completed-2",
        title: "면접 가능 여부 확인 요청(오프라인 2/3 오후 2시)",
        assignee: ["Seokmin Lee", "Heemang Lee"],
        date: new Date(2025, 1, 1).toISOString(),
        status: "completed"
    }
];

export const mockScheduleDays: ScheduleDay[] = [
    {
        id: "date-1",
        date: "2024-01-31", // 31 MON · Jan · 2024
        type: "past",
        schedules: [
            {
                id: "1",
                title: "Daily Scrum",
                startTime: "9:00 AM",
                endTime: "9:30 PM",
                type: "past",
                attendees: []
            }
        ]
    },
    {
        id: "date-2",
        date: "2024-02-10", // 10 FRI · Yesterday
        type: "past",
        schedules: [
            {
                id: "2",
                title: "Daily Scrum",
                startTime: "9:00 AM",
                endTime: "9:30 PM",
                type: "past",
                attendees: []
            },
            {
                id: "3",
                title: "OfficeMail Desktop Calendar Kickoff Meeting",
                startTime: "10:00 AM",
                endTime: "11:00 AM",
                type: "past",
                attendees: [],
                location: "Jiran 37"
            }
        ]
    },
    {
        id: "date-3",
        date: "2024-02-11", // 11 SAT · Today
        type: "future",
        schedules: [
            {
                id: "4",
                title: "OfficeMail AI Marketing Meeting",
                startTime: "10:00 AM",
                endTime: "11:00 AM",
                type: "future",
                attendees: [],
                location:
                    "FASTFIVE 7F 704, Hakdong-ro 45-gil 3, Gangam-gu Seoul"
            }
        ]
    }
];

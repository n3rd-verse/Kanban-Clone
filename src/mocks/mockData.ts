import type { Task } from "@/types/task";

export const mockTasks: Task[] = [
    {
        id: "1",
        title: "Safebox 신규 Service ID 발급 요청",
        assignee: ["김태훈", "임희정"],
        date: "2025-02-24",
        status: "new"
    },
    {
        id: "2",
        title: "Safebox 신규 Service ID 발급 요청",
        assignee: ["김태훈"],
        date: "2025-02-24",
        status: "in_progress"
    },
    {
        id: "3",
        title: "2025년 1월분 급여자료 회신 요청",
        assignee: ["예인세무회계"],
        date: "2025-02-24",
        status: "urgent"
    },
    {
        id: "4",
        title: "2025년 1월 입퇴사자 정보(입사/퇴사일자, 퇴사사유) 회신요청",
        assignee: ["예인세무회계"],
        date: "2025-02-24",
        status: "urgent"
    },
    {
        id: "5",
        title: "2025년 1월 일용근로소득, 사업소득, 기타소득 지급 여부 확인 요청",
        assignee: ["예인세무회계"],
        date: "2025-02-24",
        status: "urgent"
    },
    {
        id: "6",
        title: "명함 정보 확인 요청",
        assignee: ["Juno Kwaan"],
        date: "2024-02-04",
        status: "completed"
    },
    {
        id: "7",
        title: "면접 가능 여부 회신 요청 (오프라인 2/3 오후 2시)",
        assignee: ["Seokmin Lee", "Heemang Lee"],
        date: "2024-02-03",
        status: "completed"
    }
];

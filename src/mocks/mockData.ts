import type { Task } from "@/types/task";
import type { ScheduleDay } from "@/types/schedule";
import { TaskStatus } from "@/constants/task-status";

// 각 상태별 100개의 태스크를 생성하는 헬퍼 함수
const generateTasksForStatus = (
    status: Task["status"],
    count: number = 100
): Task[] => {
    const titles = [
        "Simply dummy text of the printing and typesetting industry.",
        "2025년 1월분 급여자료 회신 요청",
        "면접 가능 여부 확인 요청(오프라인 2/3 오후 2시)",
        "2025년 1월 입퇴사자 정보(인사/급여, 퇴직사유) 회신 요청",
        "Safebox 신규 Service ID 발급 요청",
        "프로젝트 일정 논의를 위한 미팅 요청",
        "OfficeMail Desktop Calendar Kickoff Meeting",
        "주간 보고서 작성 및 제출 요청",
        "신규 입사자 교육 자료 검토 요청",
        "2025년 예산 계획 검토 미팅"
    ];

    const locations = [
        "Jiran 37",
        "본사 3층 회의실",
        "서울시 강남구 테헤란로 123",
        "FASTFIVE 7F 704, Hakdong-ro 45-gil 3, Gangam-gu Seoul",
        "zoom.us/meeting/12345",
        "Google Meet: abc-defg-hij"
    ];

    const categories = ["important", "company", "news", "other"];

    const assignees = [
        [{ name: "김태호", email: "taehoo.kim@nextintelligence.ai" }],
        [{ name: "임지영", email: "jiyoung.im@nextintelligence.ai" }],
        [
            { name: "김태호", email: "taehoo.kim@nextintelligence.ai" },
            { name: "임지영", email: "jiyoung.im@nextintelligence.ai" }
        ],
        [{ name: "예인세무회계", email: "yoonjoo.yoon@gmail.com" }],
        [{ name: "Juno Kwaan", email: "juno.kwan@nextintelligence.ai" }],
        [
            { name: "Seokmin Lee", email: "seokmin.lee@nextintelligence.ai" },
            { name: "Heemang Lee", email: "heemang.lee@nextintelligence.ai" }
        ]
    ];

    const aiContent = [
        {
            topic: "AI Topic",
            summary:
                "AI summary, simply dummy text of the printing and typesetting industry.",
            popupInfo: [
                { "Lecture Time": "11:50 ~ 12:50" },
                { "QA Session": "20 minutes" }
            ]
        },
        {
            topic: "입사 면접",
            summary: "오후 2시에 오프라인 면접으로 가능할까요?",
            popupInfo: [
                { "면접 일시": "2025-02-03 14:00" },
                { "면접 장소": "본사 3층 회의실" },
                { 면접관: "박지원 개발실" }
            ]
        },
        {
            topic: "프로젝트 일정",
            summary: "2025년 1분기 개발 일정 및 마일스톤 논의",
            popupInfo: [
                { 시작일: "2025-01-15" },
                { 종료일: "2025-03-30" },
                { 담당자: "김태호" }
            ]
        }
    ];

    return Array.from({ length: count }, (_, index) => {
        // 다양한 날짜 생성 (1~30일 사이의 날짜)
        const day = Math.floor(Math.random() * 30) + 1;
        const month = Math.floor(Math.random() * 3) + 1; // 1~3월
        const date = new Date(2025, month - 1, day);

        // 랜덤으로 제목 선택
        const titleIndex = Math.floor(Math.random() * titles.length);

        // 랜덤으로 담당자 선택
        const assigneeIndex = Math.floor(Math.random() * assignees.length);

        // 랜덤으로 카테고리 선택
        const categoryIndex = Math.floor(Math.random() * categories.length);

        // 랜덤으로 assignedMe 선택
        const assignedMe = Math.random() < 0.5;

        // 약 20%의 확률로 AI 관련 정보 추가
        const hasAi = Math.random() < 0.2;
        const aiIndex = hasAi
            ? Math.floor(Math.random() * aiContent.length)
            : -1;

        return {
            id: `${status}-${index + 1}`,
            title: titles[titleIndex],
            assignee: assignees[assigneeIndex],
            assignedMe: assignedMe,
            category: categories[categoryIndex],
            date: date.toISOString(),
            status: status,
            ...(hasAi && { ai: aiContent[aiIndex] })
        };
    });
};

// 각 상태별로 100개씩 태스크 생성
export const mockTasks: Task[] = [
    ...generateTasksForStatus(TaskStatus.NEW),
    ...generateTasksForStatus(TaskStatus.IN_PROGRESS),
    ...generateTasksForStatus(TaskStatus.URGENT),
    ...generateTasksForStatus(TaskStatus.COMPLETED)
];

// 테스트용 함수 - 원하는 개수의 태스크를 생성
export const generateTestTasks = (count: number = 100) => {
    const statuses: TaskStatus[] = [
        TaskStatus.NEW,
        TaskStatus.IN_PROGRESS,
        TaskStatus.URGENT,
        TaskStatus.COMPLETED
    ];
    return statuses
        .map((status) => generateTasksForStatus(status, count))
        .flat();
};

// 각 상태별로 특정 개수의 태스크를 생성하는 함수
export const generateCustomTasks = (
    newCount: number = 100,
    inProgressCount: number = 100,
    urgentCount: number = 100,
    completedCount: number = 100
) => {
    return [
        ...generateTasksForStatus(TaskStatus.NEW, newCount),
        ...generateTasksForStatus(TaskStatus.IN_PROGRESS, inProgressCount),
        ...generateTasksForStatus(TaskStatus.URGENT, urgentCount),
        ...generateTasksForStatus(TaskStatus.COMPLETED, completedCount)
    ];
};

export const mockScheduleDays: ScheduleDay[] = [
    {
        id: "date-1",
        date: "2024-01-31",
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
        date: "2025-03-10",
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
        date: "2025-03-11",
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

import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const resources = {
    ko: {
        translation: {
            filter: "필터",
            categories: {
                important: "중요",
                company: "회사",
                news: "뉴스",
                other: "기타"
            },
            navigation: {
                board: "보드",
                timeline: "타임라인",
                calendar: "캘린더"
            },
            status: {
                new: "요청",
                in_progress: "진행",
                urgent: "지연",
                completed: "완료"
            },
            timeline: {
                previousMonth: "이전 달",
                nextMonth: "다음 달"
            },
            errors: {
                unknownError: "알 수 없는 오류가 발생했습니다.",
                taskNotFound: "작업을 찾을 수 없습니다.",
                failedToLoadTasks: "작업을 불러오는데 실패했습니다.",
                failedToUpdateTask: "작업 상태 업데이트에 실패했습니다.",
                failedToDeleteTask: "작업 삭제에 실패했습니다.",
                failedToRestoreTask: "작업 복원에 실패했습니다."
            },
            toast: {
                titles: {
                    dataLoadFailed: "데이터 로드 실패",
                    error: "오류",
                    success: "성공"
                },
                descriptions: {
                    taskCompleted: "작업이 완료되었습니다.",
                    taskDeleted: "작업이 삭제되었습니다.",
                    taskRestored: "작업이 복원되었습니다."
                }
            },
            components: {
                errorBoundary: {
                    title: "오류가 발생했습니다.",
                    unknownError: "알 수 없는 오류가 발생했습니다.",
                    errorFallbackTitle: "오류가 발생했습니다:",
                    tryAgainButton: "다시 시도"
                }
            },
            task: {
                deleteConfirmation: "이 작업을 삭제하시겠습니까?"
            },
            event: {
                deleteConfirmation: "이 이벤트를 삭제하시겠습니까?"
            }
        }
    },
    en: {
        translation: {
            filter: "Filter",
            categories: {
                important: "Important",
                company: "Company",
                news: "News",
                other: "Other"
            },
            navigation: {
                board: "Board",
                timeline: "Timeline",
                calendar: "Calendar"
            },
            status: {
                new: "Requested",
                in_progress: "In Progress",
                urgent: "Overdue",
                completed: "Completed"
            },
            timeline: {
                previousMonth: "Previous Month",
                nextMonth: "Next Month"
            },
            errors: {
                unknownError: "An unknown error occurred.",
                taskNotFound: "Task not found",
                failedToLoadTasks: "Failed to load tasks",
                failedToUpdateTask: "Failed to update task status",
                failedToDeleteTask: "Failed to delete task",
                failedToRestoreTask: "Failed to restore task"
            },
            toast: {
                titles: {
                    dataLoadFailed: "Failed to load data",
                    error: "Error",
                    success: "Success"
                },
                descriptions: {
                    taskCompleted: "Task completed",
                    taskDeleted: "Task deleted",
                    taskRestored: "Task restored"
                }
            },
            components: {
                errorBoundary: {
                    title: "Something went wrong",
                    unknownError: "Unknown error occurred",
                    errorFallbackTitle: "Something went wrong:",
                    tryAgainButton: "Try again"
                }
            },
            task: {
                deleteConfirmation: "Are you sure you want to delete this task?"
            },
            event: {
                deleteConfirmation:
                    "Are you sure you want to delete this event?"
            }
        }
    }
};

i18n.use(initReactI18next).init({
    resources,
    lng: "en",
    fallbackLng: "en",
    interpolation: {
        escapeValue: false
    },
    debug: false
});

export default i18n;

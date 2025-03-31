/**
 * 공통 에러 메시지
 */
export const ERROR_MESSAGES = {
    UNKNOWN_ERROR: "알 수 없는 오류가 발생했습니다.",
    TASK_NOT_FOUND: "Task not found",
    FAILED_TO_LOAD_TASKS: "Failed to load tasks",
    FAILED_TO_UPDATE_TASK: "Failed to update task status",
    FAILED_TO_DELETE_TASK: "Failed to delete task",
    FAILED_TO_DELETE_EVENT: "Failed to delete event"
};

/**
 * 토스트 메시지
 */
export const TOAST_MESSAGES = {
    TITLES: {
        DATA_LOAD_FAILED: "Failed to load data",
        ERROR: "Error",
        SUCCESS: "Success"
    },
    DESCRIPTIONS: {
        TASK_COMPLETED: "Task completed"
    }
};

/**
 * 컴포넌트 텍스트
 */
export const COMPONENT_TEXT = {
    ERROR_BOUNDARY: {
        TITLE: "Something went wrong",
        UNKNOWN_ERROR: "Unknown error occurred",
        ERROR_FALLBACK_TITLE: "Something went wrong:",
        TRY_AGAIN_BUTTON: "Try again"
    }
};

/**
 * i18n 통합을 위한 메시지 구조
 * 향후 i18n을 완전히 통합할 때 이 객체를 사용할 수 있습니다.
 */
export const I18N_MESSAGES = {
    errors: {
        unknownError: "알 수 없는 오류가 발생했습니다.",
        taskNotFound: "Task not found",
        failedToLoadTasks: "Failed to load tasks",
        failedToUpdateTask: "Failed to update task status"
    },
    toast: {
        titles: {
            dataLoadFailed: "Failed to load data",
            error: "Error",
            success: "Success"
        },
        descriptions: {
            taskCompleted: "Task completed"
        }
    },
    components: {
        errorBoundary: {
            title: "Something went wrong",
            unknownError: "Unknown error occurred",
            errorFallbackTitle: "Something went wrong:",
            tryAgainButton: "Try again"
        }
    }
};

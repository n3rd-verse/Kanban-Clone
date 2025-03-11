import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const resources = {
    ko: {
        translation: {
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
            task: {
                deleteConfirmation: "이 작업을 삭제하시겠습니까?"
            }
        }
    },
    en: {
        translation: {
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
            task: {
                deleteConfirmation: "Are you sure you want to delete this task?"
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

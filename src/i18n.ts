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
                new: "New",
                in_progress: "In Progress",
                urgent: "Urgent",
                completed: "Completed"
            }
        }
    }
};

i18n.use(initReactI18next).init({
    resources,
    lng: "ko", // 기본 언어
    fallbackLng: "en", // 번역이 없을 경우 영어로
    interpolation: {
        escapeValue: false
    }
});

export default i18n;

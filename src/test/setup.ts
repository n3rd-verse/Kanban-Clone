import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import "@testing-library/jest-dom/vitest";

i18n.use(initReactI18next).init({
    lng: "en",
    fallbackLng: "en",
    ns: ["translations"],
    defaultNS: "translations",
    resources: {
        en: {
            translations: {}
        }
    },
    interpolation: {
        escapeValue: false
    }
});

export default i18n;

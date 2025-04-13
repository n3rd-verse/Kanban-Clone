/**
 * 토스트 관련 설정 상수
 */
export const TOAST_CONFIG = {
    /** 토스트 최대 표시 개수 */
    LIMIT: 10,

    /** 토스트가 닫힌 후 DOM에서 제거되는 시간 (ms) */
    REMOVE_DELAY: 1000,

    /** 토스트 지속 시간 (ms) */
    DURATIONS: {
        /** 짧은 토스트 지속 시간 (3초) */
        SHORT: 3000,
        /** 기본 토스트 지속 시간 (6초) */
        DEFAULT: 6000,
        /** 긴 토스트 지속 시간 (10초) */
        LONG: 10000
    }
};

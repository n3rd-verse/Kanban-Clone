import { RefObject, useEffect } from "react";

interface UseIntersectionObserverProps {
    target: RefObject<HTMLElement>;
    onIntersect: () => void;
    enabled?: boolean;
    rootMargin?: string;
    threshold?: number;
}

export function useIntersectionObserver({
    target,
    onIntersect,
    enabled = true,
    rootMargin = "200px",
    threshold = 0.1
}: UseIntersectionObserverProps) {
    useEffect(() => {
        if (!enabled) return;

        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting) {
                    onIntersect();
                }
            },
            { rootMargin, threshold }
        );

        target.current && observer.observe(target.current);
        return () => observer.disconnect();
    }, [target, enabled, onIntersect, rootMargin, threshold]);
}

import { RefObject, useEffect } from "react";

interface UseIntersectionObserverProps {
    target: RefObject<HTMLElement>;
    onIntersect: () => void;
    enabled?: boolean;
    rootMargin?: string;
    threshold?: number;
}

/**
 * Custom hook that observes when a target element intersects the viewport.
 * @param props.target - Ref object pointing to the element to observe.
 * @param props.onIntersect - Callback function executed when the element intersects.
 * @param props.enabled - Whether the observer is active (default: true).
 * @param props.rootMargin - Margin around the root for intersections (default: "200px").
 * @param props.threshold - Intersection threshold ratio (default: 0.1).
 */
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

import { useEffect, useState } from "react";

/**
 * Custom hook to monitor window size changes.
 * @returns An object with the current viewport dimensions:
 *   - width: number - the window inner width in pixels.
 *   - height: number - the window inner height in pixels.
 */
export function useWindowSize() {
    const [size, setSize] = useState({
        width: window.innerWidth,
        height: window.innerHeight
    });

    useEffect(() => {
        const handleResize = () => {
            setSize({
                width: window.innerWidth,
                height: window.innerHeight
            });
        };

        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    return size;
}

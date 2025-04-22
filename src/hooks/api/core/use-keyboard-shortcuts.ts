import { useEffect, useRef } from "react";

type KeyCombo = {
    key: string;
    ctrlKey?: boolean;
    metaKey?: boolean;
    shiftKey?: boolean;
    altKey?: boolean;
};

type KeyboardShortcut = {
    combo: KeyCombo | KeyCombo[];
    action: (event: KeyboardEvent) => void;
    preventDefault?: boolean;
    description?: string;
};

/**
 * Hook for managing keyboard shortcuts in a centralized way
 *
 * @param shortcuts Array of keyboard shortcuts to register
 * @param enabled Whether shortcuts are enabled (defaults to true)
 * @returns Object with methods to control shortcuts
 */
export const useKeyboardShortcuts = (
    shortcuts: KeyboardShortcut[],
    enabled = true
) => {
    const shortcutsRef = useRef(shortcuts);

    // Update ref if shortcuts change
    useEffect(() => {
        shortcutsRef.current = shortcuts;
    }, [shortcuts]);

    useEffect(() => {
        if (!enabled) return;

        const handleKeyDown = (event: KeyboardEvent) => {
            for (const shortcut of shortcutsRef.current) {
                const { combo, action, preventDefault = true } = shortcut;

                const combos = Array.isArray(combo) ? combo : [combo];

                for (const c of combos) {
                    const matches =
                        event.key === c.key &&
                        (!c.ctrlKey || event.ctrlKey) &&
                        (!c.metaKey || event.metaKey) &&
                        (!c.shiftKey || event.shiftKey) &&
                        (!c.altKey || event.altKey);

                    if (matches) {
                        if (preventDefault) {
                            event.preventDefault();
                        }
                        action(event);
                        return;
                    }
                }
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [enabled]);

    return {
        isEnabled: enabled,
        getRegisteredShortcuts: () => [...shortcutsRef.current]
    };
};

/**
 * Helper function to create an Undo keyboard shortcut (Ctrl+Z or Command+Z)
 */
export const createUndoShortcut = (action: () => void): KeyboardShortcut => ({
    combo: [
        { key: "z", ctrlKey: true }, // Windows/Linux
        { key: "z", metaKey: true } // Mac
    ],
    action: () => action(),
    preventDefault: true,
    description: "Undo last action"
});

/**
 * Helper function to create a Redo keyboard shortcut (Ctrl+Y or Command+Shift+Z)
 */
export const createRedoShortcut = (action: () => void): KeyboardShortcut => ({
    combo: [
        { key: "y", ctrlKey: true }, // Windows/Linux style
        { key: "z", metaKey: true, shiftKey: true } // Mac style
    ],
    action: () => action(),
    preventDefault: true,
    description: "Redo last undone action"
});

import { Task } from "@/types/task";

/**
 * Extracts the ID prefix from a task ID
 * @param id Task identifier
 * @returns The prefix segment or null if invalid
 */
export const extractIdPrefix = (id: string): string | null => {
    if (!id) return null;
    const segments = id.split("-");
    return segments.length > 1 ? segments[0] : null;
};

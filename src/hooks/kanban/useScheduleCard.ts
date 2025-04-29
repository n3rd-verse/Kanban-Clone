import { useState, useCallback, useMemo } from "react";
import type { Schedule } from "@/types/schedule";
import { useDeleteScheduleMutation } from "@/hooks/api/schedules/use-delete-schedule-mutation";
import { useOpenScheduleMutation } from "@/hooks/api/schedules/use-open-schedule-mutation";

/**
 * Custom hook managing the state and interactions for a ScheduleCard component.
 * Handles delete, open, and AI summary visibility and hover state.
 * @param schedule - The Schedule object to manage and operate on.
 * @returns An object containing state and handlers for the schedule card
 */
export function useScheduleCard(schedule: Schedule) {
    const { mutate: deleteSchedule, isPending: isDeleting } =
        useDeleteScheduleMutation();
    const { mutate: openSchedule } = useOpenScheduleMutation();
    const [showAiSummary, setShowAiSummary] = useState(false);
    const [startPos, setStartPos] = useState({ x: 0, y: 0 });
    const [isHoveringCard, setIsHoveringCard] = useState(false);
    const [isHoveringPopover, setIsHoveringPopover] = useState(false);

    const handleDelete = useCallback(
        (e?: React.MouseEvent) => {
            if (e) {
                e.stopPropagation();
            }

            if (
                window.confirm("Are you sure you want to delete this schedule?")
            ) {
                deleteSchedule(schedule.id);
            }
        },
        [deleteSchedule, schedule.id]
    );

    const handleMouseDown = useCallback((e: React.MouseEvent) => {
        setStartPos({ x: e.clientX, y: e.clientY });
    }, []);

    const handleClick = useCallback(
        (e: React.MouseEvent) => {
            const diffX = Math.abs(e.clientX - startPos.x);
            const diffY = Math.abs(e.clientY - startPos.y);
            const threshold = 5;

            if (diffX > threshold || diffY > threshold) {
                return;
            }

            openSchedule(schedule.id);
        },
        [openSchedule, schedule.id, startPos]
    );

    const handleCardMouseEnter = useCallback(() => {
        setIsHoveringCard(true);
        setShowAiSummary(true);
    }, []);

    const handleCardMouseLeave = useCallback(() => {
        setIsHoveringCard(false);
        // Only hide popover if not hovering over the popover itself
        if (!isHoveringPopover) {
            setShowAiSummary(false);
        }
    }, [isHoveringPopover]);

    const handlePopoverMouseEnter = useCallback(() => {
        setIsHoveringPopover(true);
        setShowAiSummary(true);
    }, []);

    const handlePopoverMouseLeave = useCallback(() => {
        setIsHoveringPopover(false);
        // Only hide popover if not hovering over the card
        if (!isHoveringCard) {
            setShowAiSummary(false);
        }
    }, [isHoveringCard]);

    const handlePopoverOpenChange = useCallback(
        (open: boolean) => {
            // Only allow external changes to close the popover if we're not hovering either element
            if (!open && !isHoveringCard && !isHoveringPopover) {
                setShowAiSummary(open);
            } else if (open) {
                setShowAiSummary(open);
            }
        },
        [isHoveringCard, isHoveringPopover]
    );

    const contentInfo = useMemo(() => {
        const hasAttendees =
            schedule.attendees && schedule.attendees.length > 0;
        const hasLocation = !!schedule.location;
        const hasTimeInfo =
            schedule.startTime != null || schedule.endTime != null;
        const isPast = schedule.type === "past";

        return {
            hasAttendees,
            hasLocation,
            hasTimeInfo,
            isPast
        };
    }, [
        schedule.attendees,
        schedule.location,
        schedule.startTime,
        schedule.endTime,
        schedule.type
    ]);

    const hasAiContent = !!schedule.ai?.summary || !!schedule.ai?.popupInfo;

    return {
        state: {
            showAiSummary,
            isLoading: isDeleting,
            contentInfo,
            hasAiContent
        },
        handlers: {
            handleDelete,
            handleClick,
            handleMouseDown,
            handleCardMouseEnter,
            handleCardMouseLeave,
            handlePopoverOpenChange,
            handlePopoverMouseEnter,
            handlePopoverMouseLeave
        }
    };
}

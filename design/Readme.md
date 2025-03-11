# Dashboard Design Documentation

## Type Definitions

### Native Bridge Interface (om-native.d.ts)
- Location: `src/types/om-native.d.ts`
- Purpose: Provides TypeScript type definitions for the NineNative bridge interface that's injected into the window object
- Components:
  - `OMNative` interface: Defines methods available through the native bridge
  - `Window` interface extension: Adds NineNative to the global window object
- Methods:
  - `getTasks()`: Returns a Promise containing tasks data as a JSON string
  - `openTask(taskId: string)`: Opens a task detail view for the specified task ID

## Internationalization (i18n)

### Task-related Translations
- Location: `src/i18n.ts`
- Implementation: Added translations for task-related messages in both Korean and English
- Keys:
  - `task.deleteConfirmation`: Confirmation message when deleting a task
    - English: "Are you sure you want to delete this task?"
    - Korean: "이 작업을 삭제하시겠습니까?"

### Implementation in Components
- TaskCard Component (`src/components/KanbanBoard/TaskCard.tsx`)
  - Uses `useTranslation` hook from react-i18next
  - Applies translation using the `t` function with the appropriate key
  - Example: `t("task.deleteConfirmation")` for the task deletion confirmation dialog

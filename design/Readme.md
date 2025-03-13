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

### Task Interface
- Location: `src/types/task.ts`
- Purpose: Defines the structure of task objects used throughout the application
- Key Components:
  - `Address` interface: Defines the structure for assignee contact information
    - Properties:
      - `name`: The display name of the assignee
      - `email`: The email address of the assignee, used for contact functionality
  
  - `TaskStatus` type: Enumeration of possible task statuses
    - Values: `"new"`, `"in_progress"`, `"urgent"`, `"completed"`
    - Usage: Controls the visual state and column placement in the Kanban board
  
  - `Task` interface: Main task data structure
    - Core Properties:
      - `id`: Unique identifier for the task
      - `title`: Task title/description text
      - `assignee`: Array of Address objects containing name and email information
      - `date`: ISO string representing the task date
      - `status`: Current task status (type: TaskStatus)
      - `allowEdit`: Optional boolean flag to control editability
    
    - AI-related Properties (Optional):
      - `ai.topic`: Brief topic or category of the AI-generated content
      - `ai.summary`: Condensed summary of the task content
      - `ai.popupInfo`: Array of key-value pair objects that can contain duplicate keys
        - Format: `[{ "key": "value" }, { "anotherKey": "anotherValue" }, { "key": "duplicateKeyExample" }]`
        - Rendering: Displayed in a popover when clicking the info button
  
  - `TaskDTO` interface: Data transfer object for task API operations
    - Extends the `Task` interface with slight modifications
    - Differences: `assignee` can be either a single Address object or an array of Address objects
  
  - `TaskFilters` interface: Used for filtering tasks in listings
    - Supports filtering by status, assignee, date range, and text search
    - Includes pagination parameters (limit, page)
  
  - `TasksResponse` interface: API response format for task listings
    - Contains array of tasks, total count, and optional next page information

## Contact Functionality
- Purpose: Enables users to access contact details directly from task assignees
- Components:
  - `openContact` function: Service method that opens contact details via the native bridge
    - Location: `src/services/contacts.ts`
    - Parameters: Takes an email address string to identify the contact
  - `useOpenContactMutation` hook: React Query mutation for opening contacts
    - Location: `src/hooks/api/contacts/use-open-contact-mutation.ts`
    - Usage: Invoked when clicking on an assignee name in the TaskCard component

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

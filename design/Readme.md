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

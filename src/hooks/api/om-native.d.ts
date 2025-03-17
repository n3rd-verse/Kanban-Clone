interface OMNative {
    deleteTask(taskId: string, callback: (success: boolean) => void): boolean;
    getTasks(filters: string, callback: (json: string) => void): boolean;
    completeTask(taskId: string, callback: (success: boolean) => void): boolean;
    clearTask(taskId: string, callback: (success: boolean) => void): boolean;
    openTask(taskId: string): Promise<void>;
    openContact(name?: string, email: string): Promise<void>;
    openSchedule(scheduleId: string): Promise<void>;
    getSchedules(callback: (json: string) => void): boolean;
}

declare interface Window {
    OMNative: OMNative;
    refreshTasks?: () => void;
    refreshSchedules?: () => void;
    changeLanguage?: (lang: string) => void;
}

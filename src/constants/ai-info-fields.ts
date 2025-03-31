export const AI_INFO_FIELD = {
    TIME_RANGE: {
        START_TIME: 'startTime',
        END_TIME: 'endTime'
    },
    DURATION: 'duration',
    DATETIME: {
        DATE: 'date',
        TIME: 'time'
    },
    CONTACT: {
        NAME: 'name',
        DEPARTMENT: 'department'
    },
    LOCATION: 'location'
} as const;

export type TimeRange = {
    [AI_INFO_FIELD.TIME_RANGE.START_TIME]: string;
    [AI_INFO_FIELD.TIME_RANGE.END_TIME]: string;
};

export type DateTime = {
    [AI_INFO_FIELD.DATETIME.DATE]: string;
    [AI_INFO_FIELD.DATETIME.TIME]?: string;
};

export type Contact = {
    [AI_INFO_FIELD.CONTACT.NAME]: string;
    [AI_INFO_FIELD.CONTACT.DEPARTMENT]: string;
};

export type Duration = {
    [AI_INFO_FIELD.DURATION]: string;
};

export type Location = {
    [AI_INFO_FIELD.LOCATION]: string;
};

export type AiInfoValue = 
    | string 
    | TimeRange 
    | DateTime 
    | Contact 
    | Duration 
    | Location;
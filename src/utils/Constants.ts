

export enum SCHEDULE_STATUS {
    AVAILABLE = "AVAILABLE",
    UNAVAILABLE = "UNAVAILABLE",
    ON_LEAVE = "ON_LEAVE",
    NO_SCHEDULE = "NO_SCHEDULE"
}



export const APPROVAL_MESSAGES = {
    SUCCESS_SUBJECT: "Account Approved",
    REJECT_SUBJECT: "Application Update",
    SUCCESS_BODY: (name: string) => `Hello ${name}, your professional trainer account has been approved!`,
    REJECT_BODY: (name: string, reason: string) => `Hello ${name}, your application was declined. Reason: ${reason}`,
    LOG_SUCCESS: "Trainer approved successfully",
    LOG_REJECT: "Trainer declined successfully"
};

export enum TRAINER_STATUS_MESSAGES {
    BLOCK_SUCCESS = "Trainer access has been restricted.",
    UNBLOCK_SUCCESS = "Trainer access has been restored.",
    UPDATE_FAILED = "Failed to update trainer status."
};

export enum USER_STATUS_MESSAGES {
    BLOCK_SUCCESS = "Client access has been restricted.",
    UNBLOCK_SUCCESS = "Client access has been restored.",
    UPDATE_FAILED = "Failed to update Client status."
};

export enum USER_STATUS_FILTERS {
    ACTIVE = 'active',
    BLOCKED = 'blocked',
    ALL = 'all'
}

export enum MAX_LEAVE_COUNT {
    MEDICAL = 12,
    SICK = 10,
    CASUAL = 5
}

export const PAGINATION = {
    DEFAULT_LIMIT: 10,
    MAX_LIMIT: 50,
    ADMIN_PAGE_LIMIT: 20,
    CHAT_DASHBOARD_LIMIT: 5
};

export const AUTH_CONSTANTS = {
    REFRESH_TOKEN_COOKIE: "refreshToken",
};


export const FILE_CONSTANTS = {
    PDF_MIME_TYPE: 'application/pdf',
    DASHBOARD_PREFIX: 'FitTribe-Dashboard-Report',
    LEAVE_REPORT_PREFIX: 'FitTribe-Leave-Report',
    CHURN_USERS_REPORT: "FitTribe-Churn-Users-Report"
};

export enum BOOKING_TYPES {
    UPCOMING = 'UPCOMING',
    PAST = 'PAST',
    TODAY = 'TODAY',
    ALL = 'ALL'
}

export enum TrainerSortOptions {
    RATING = 'rating',
    EXPERIENCE = 'exp',
    LATEST = 'latest'
}


export enum DATE_RANGES {
    ALL_TIME = "1D",
    ONE_MONTH = "30D",
    THREE_MONTH = "90D"
}


export enum ACTIONS {
    ACCEPT = "accept",
    REJECT = "reject",
}


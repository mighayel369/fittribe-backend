
export interface IMeetingService {
    generateLink(identifier: string): string;
}

export const I_MEETING_SERVICE_TOKEN = Symbol("IMeetingService");
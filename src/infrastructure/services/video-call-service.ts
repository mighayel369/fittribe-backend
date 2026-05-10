
import { IMeetingService } from "domain/services/i-meeting-service";
import config from "config";

export class VideoCallService implements IMeetingService {
    generateLink(identifier: string): string {
        const sanitizedId = identifier.replace(/-/g, '_');
        const uniqueSuffix = Date.now().toString(36);
        const roomName = `FitTribe_Session_${sanitizedId}_${uniqueSuffix}`;


        return `${config.MEETING_URL}/${roomName}`;
    }
}
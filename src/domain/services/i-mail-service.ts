
export const I_EMAIL_SERVICE_TOKEN = Symbol("I_EMAIL_SERVICE_TOKEN")

export interface IMailService {
    sendHtmlEmail(to: string, subject: string, html: string): Promise<void>
}
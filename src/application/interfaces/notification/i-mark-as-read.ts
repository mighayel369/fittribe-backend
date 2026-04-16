export const I_MARK_NOTIFICATION_AS_READ_TOKEN = Symbol("I_MARK_NOTIFICATION_AS_READ_TOKEN");
export const I_MARK_ALL_NOTIFICATIONS_AS_READ_TOKEN = Symbol("I_MARK_ALL_NOTIFICATIONS_AS_READ_TOKEN");

export interface IMarkAsRead{
    execute(id:string):Promise<void>
}
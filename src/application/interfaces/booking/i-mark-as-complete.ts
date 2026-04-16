export const I_MARK_AS_COMPLETE_TOKEN = Symbol("I_MARK_AS_COMPLETE_TOKEN");

export interface IMarkAsComplete{
    execute(bookingId:string):Promise<void>
}
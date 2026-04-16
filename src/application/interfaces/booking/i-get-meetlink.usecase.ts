export const I_GET_MEET_LINK_TOKEN = Symbol("I_GET_MEET_LINK_TOKEN");

export interface IGetMeetLink{
    execute(bookingId:string):Promise<string>
}
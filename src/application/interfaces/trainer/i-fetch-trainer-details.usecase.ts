
export const I_FETCH_TRAINER_DETAILS_TOKEN = Symbol("I_FETCH_TRAINER_DETAILS_TOKEN");

export const I_FETCH_TRAINER_DETAILS_ADMIN_TOKEN = Symbol("I_FETCH_TRAINER_DETAILS_ADMIN_TOKEN");
export const I_FETCH_TRAINER_DETAILS_CLIENT_TOKEN = Symbol("I_FETCH_TRAINER_DETAILS_CLIENT_TOKEN");
export interface IFetchTrainerDetails<responseDTO>{
    execute(trainerId:string,userId?:string):Promise<responseDTO>
}
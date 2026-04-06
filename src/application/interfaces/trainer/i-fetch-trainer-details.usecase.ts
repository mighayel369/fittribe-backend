
export interface IFetchTrainerDetails<responseDTO>{
    execute(trainerId:string,userId?:string):Promise<responseDTO>
}
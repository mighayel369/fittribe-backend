import { IFetchTrainerDetails } from "application/interfaces/trainer/i-fetch-trainer-details.usecase";
import { inject, injectable } from "tsyringe";
import { I_TRAINER_REPO_TOKEN, ITrainerRepo } from "domain/repositories/ITrainerRepo";
import { UserTrainerViewDTO } from "application/dto/trainer/fetch-trainer-details.dto";
import { AppError } from "domain/errors/AppError";
import { ERROR_MESSAGES } from "utils/ErrorMessage";
import { HttpStatus } from "utils/HttpStatus";
import { TrainerMapper } from "application/mappers/trainer-mapper";
import { I_CHAT_REPO_TOKEN, IChatRepo } from "domain/repositories/IChatRepo";

@injectable()
export class FetchTrainerDetailsForClient implements IFetchTrainerDetails<UserTrainerViewDTO> {
  constructor(
    @inject(I_TRAINER_REPO_TOKEN) private readonly _trainerRepo: ITrainerRepo,
    @inject(I_CHAT_REPO_TOKEN) private readonly _chatRepo: IChatRepo 
  ) {}

  async execute(trainerId: string,userId:string): Promise<UserTrainerViewDTO> {
    if(!trainerId){
      throw new AppError(ERROR_MESSAGES.INVALID_CREDENTIALS,HttpStatus.BAD_REQUEST)
    }

    let trainer=await this._trainerRepo.findTrainerById(trainerId)
    if(!trainer){
      throw new AppError(ERROR_MESSAGES.TRAINER_NOT_FOUND,HttpStatus.NOT_FOUND)
    }

    return TrainerMapper.toUserTrainerViewDTO(trainer)
  }
}

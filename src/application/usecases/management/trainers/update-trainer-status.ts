
import { IUpdateStatus } from "application/interfaces/common/i-update-status.usecase";
import { inject, injectable } from "tsyringe";
import { ITrainerRepo, I_TRAINER_REPO_TOKEN } from "domain/repositories/ITrainerRepo";
import { AppError } from "domain/errors/AppError";
import { HttpStatus } from "utils/HttpStatus";
import logger from "../../../../logger/index";
import { UpdateTrainerStatusRequestDTO } from "application/dto/management/trainer-management/update-trainer-status.dto";
import { ERROR_MESSAGES } from "utils/ErrorMessage";

@injectable()
export class UpdateTrainerStatusUseCase implements IUpdateStatus<UpdateTrainerStatusRequestDTO> {
  private logger = logger;
  constructor(
    @inject(I_TRAINER_REPO_TOKEN)
    private readonly _trainerRepository: ITrainerRepo
  ) { }

  async execute(statusData: UpdateTrainerStatusRequestDTO): Promise<void> {
    const { trainerId, isActive } = statusData;

    const trainer = await this._trainerRepository.findTrainerById(trainerId);
    if (!trainer) {
      throw new AppError(ERROR_MESSAGES.TRAINER_NOT_FOUND, HttpStatus.NOT_FOUND);
    }

    this.logger.info(`Admin Management: Setting Trainer ${trainerId} status to ${isActive ? 'Active' : 'Blocked'}`);

    await this._trainerRepository.updateTrainerStatus(trainerId, isActive);
  }
}
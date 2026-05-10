
import { IUpdateStatus } from "application/interfaces/common/i-update-status.usecase";
import { inject, injectable } from "tsyringe";
import { ITrainerRepo, I_TRAINER_REPO_TOKEN } from "domain/repositories/ITrainerRepo";
import { AppError } from "domain/errors/AppError";
import { HttpStatus } from "utils/HttpStatus";
import logger from "utils/logger";
import { UpdateStatusRequestDTO } from "application/dto/common/update-status.dto";
import { ERROR_MESSAGES } from "utils/ErrorMessage";

@injectable()
export class UpdateTrainerStatusUseCase implements IUpdateStatus {
  constructor(
    @inject(I_TRAINER_REPO_TOKEN)
    private readonly _trainerRepository: ITrainerRepo
  ) { }

  async execute(statusData: UpdateStatusRequestDTO): Promise<void> {
    const { id, isActive } = statusData;

    const trainer = await this._trainerRepository.findTrainerById(id);
    if (!trainer) {
      throw new AppError(ERROR_MESSAGES.TRAINER_NOT_FOUND, HttpStatus.NOT_FOUND);
    }

    logger.info(`Admin Management: Setting Trainer ${id} status to ${isActive ? 'Active' : 'Blocked'}`);

    await this._trainerRepository.updateTrainerStatus(id, isActive);
  }
}
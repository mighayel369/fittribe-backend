import { inject, injectable } from "tsyringe";
import { ITrainerRepo, I_TRAINER_REPO_TOKEN } from "domain/repositories/ITrainerRepo";

import { I_CLOUDINARY_SERVICE_TOKEN, ICloudinaryService } from "domain/services/ICloudinaryService";

import { IReapplyTrainer } from "application/interfaces/trainer/i-reapply-trainer.usecase";
import { ReapplyTrainerRequestDTO } from "application/dto/trainer/update-trainer-profile.dto";

import { AppError } from "domain/errors/AppError";
import { HttpStatus } from "utils/HttpStatus";
import { TRAINER_STATUS } from "domain/constants/trainer-status";
import { ERROR_MESSAGES } from "utils/ErrorMessage";

@injectable()
export class ReapplyTrainerUseCase implements IReapplyTrainer {
  constructor(
    @inject(I_TRAINER_REPO_TOKEN)
    private readonly _trainerRepository: ITrainerRepo,

    @inject(I_CLOUDINARY_SERVICE_TOKEN)
    private readonly _cloudinaryService: ICloudinaryService
  ) { }

  async execute(reapplyRequest: ReapplyTrainerRequestDTO): Promise<void> {
    const { trainerId, data } = reapplyRequest;

    const existingTrainer =
      await this._trainerRepository.findTrainerById(trainerId);

    if (!existingTrainer) {
      throw new AppError(
        ERROR_MESSAGES.TRAINER_NOT_FOUND,
        HttpStatus.NOT_FOUND
      );
    }

    let certificateUrl = existingTrainer.certificate;

    if (data.certificate) {
      certificateUrl =
        await this._cloudinaryService.getTrainerCertificateUrl(
          data.certificate,
          existingTrainer.email
        );
    }

    const updatedTrainer = existingTrainer.update({
      name: data.name,
      verified: TRAINER_STATUS.PENDING,
      pricePerSession: data.pricePerSession,
      languages: data.languages,
      experience: data.experience,
      programs: data.programs,
      certificate: certificateUrl,
      gender: data.gender,
      bio: null
    });

    await this._trainerRepository.updateTrainer(
      trainerId,
      updatedTrainer
    );
  }
}
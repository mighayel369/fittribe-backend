import { inject, injectable } from "tsyringe";
import { IUpdateTrainerProfileUseCase } from "application/interfaces/trainer/i-update-trainer-profile.usecase";
import { UpdateTrainerProfileRequestDTO } from "application/dto/trainer/update-trainer-profile.dto";

import { ITrainerRepo, I_TRAINER_REPO_TOKEN } from "domain/repositories/ITrainerRepo";

import { I_NOTIFICATION_REPO_TOKEN, INotificationRepo } from "domain/repositories/INotifctionRepo";

import { I_NOTIFICATION_SERVICE_TOKEN, INotificationService } from "domain/services/i-notification.service";

import { NotificationMapper } from "application/mappers/notification-mapper";
import { AppError } from "domain/errors/AppError";
import { HttpStatus } from "utils/HttpStatus";
import { ERROR_MESSAGES } from "utils/ErrorMessage";

@injectable()
export class UpdateTrainerProfileUseCase
  implements IUpdateTrainerProfileUseCase {
  constructor(
    @inject(I_TRAINER_REPO_TOKEN)
    private readonly _trainerRepository: ITrainerRepo,

    @inject(I_NOTIFICATION_SERVICE_TOKEN)
    private readonly _notificationService: INotificationService,

    @inject(I_NOTIFICATION_REPO_TOKEN)
    private readonly _notificationRepository: INotificationRepo
  ) { }

  async execute(updateRequest: UpdateTrainerProfileRequestDTO): Promise<void> {
    const { trainerId, data } = updateRequest;

    const existingTrainer =
      await this._trainerRepository.findTrainerById(trainerId);

    if (!existingTrainer) {
      throw new AppError(
        ERROR_MESSAGES.TRAINER_NOT_FOUND,
        HttpStatus.NOT_FOUND
      );
    }

    if (existingTrainer.isBlocked()) {
      throw new AppError(
        ERROR_MESSAGES.TRAINER_BLOCKED,
        HttpStatus.FORBIDDEN
      );
    }

    const updatedTrainer = existingTrainer.update({
      name: data.name,
      pricePerSession: data.pricePerSession,
      languages: data.languages,
      experience: data.experience,
      programs: data.programs,
      bio: data.bio,
      phone: data.phone,
      address: data.address,
      gender: data.gender
    });

    await this._trainerRepository.updateTrainer(
      trainerId,
      updatedTrainer
    );

    await this._dispatchUpdateNotification(trainerId);
  }

  private async _dispatchUpdateNotification(
    trainerId: string
  ): Promise<void> {
    const notification = NotificationMapper.toCreateEntity({
      message: "Your profile has been updated successfully.",
      title: "Profile Update",
      recipientId: trainerId,
      senderId: "SYSTEM_SECURITY"
    });

    await this._notificationRepository.addNotification(notification);

    await this._notificationService.notifyUser(
      notification.recipientId,
      NotificationMapper.toResponseDTO(notification)
    );
  }
}
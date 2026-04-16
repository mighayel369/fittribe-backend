import { injectable, inject } from "tsyringe";
import { IUpdateTrainerProfileUseCase } from "application/interfaces/trainer/i-update-trainer-profile.usecase";
import { AppError } from "domain/errors/AppError";
import { HttpStatus } from "utils/HttpStatus";
import { UpdateTrainerProfileRequestDTO } from "application/dto/trainer/update-trainer-profile.dto";
import { TrainerEntity } from "domain/entities/TrainerEntity";
import { ERROR_MESSAGES } from "utils/ErrorMessage";
import { I_TRAINER_REPO_TOKEN, ITrainerRepo } from "domain/repositories/ITrainerRepo";
import { NotificationMapper } from "application/mappers/notification-mapper";
import { I_NOTIFICATION_REPO_TOKEN, INotificationRepo } from "domain/repositories/INotifctionRepo";
import { I_NOTIFICATION_SERVICE_TOKEN, INotificationService } from "domain/services/i-notification.service";
@injectable()
export class UpdateTrainerProfileUseCase implements IUpdateTrainerProfileUseCase {
  constructor(
    @inject(I_TRAINER_REPO_TOKEN) private readonly _trainerRepo: ITrainerRepo,
    @inject(I_NOTIFICATION_SERVICE_TOKEN) private _notificationService: INotificationService,
    @inject(I_NOTIFICATION_REPO_TOKEN) private _notificationRepo: INotificationRepo
  ) { }

  async execute(input: UpdateTrainerProfileRequestDTO): Promise<void> {
    const { trainerId, data } = input;
    console.log(data)
    const existing = await this._trainerRepo.findTrainerById(trainerId);
    if (!existing) {
      throw new AppError(ERROR_MESSAGES.USER_NOT_FOUND, HttpStatus.NOT_FOUND);
    }

    const updatedTrainer = new TrainerEntity(
      trainerId,
      data.name || existing.name,
      existing.email,
      existing.role,
      existing.verified,
      data.pricePerSession ?? existing.pricePerSession,
      existing.password,
      data.languages ?? existing.languages,
      data.experience ?? existing.experience,
      data.programs,
      existing.certificate,
      data.gender ?? existing.gender,
      existing.rating,
      existing.reviewCount,
      existing.status,
      existing.createdAt,
      data.bio ?? existing.bio,
      data.phone ?? existing.phone,
      data.address ?? existing.address,
      existing.rejectReason,
      existing.profilePic
    );

    if (updatedTrainer.isBlocked()) {
      throw new AppError(ERROR_MESSAGES.ACCOUNT_BLOCKED, HttpStatus.FORBIDDEN);
    }

    await this._trainerRepo.updateTrainer(trainerId, updatedTrainer);
    const trainerNotif = NotificationMapper.toCreateEntity({
      message: `Your profile updated`,
      title: "Profile Updation",
      recipientId: trainerId,
      senderId: "SYSTEM_SECURITY",
    });
    await this._notificationRepo.addNotification(trainerNotif);
    await this._notificationService.notifyUser(trainerNotif.recipientId, NotificationMapper.toResponseDTO(trainerNotif))
  }
}
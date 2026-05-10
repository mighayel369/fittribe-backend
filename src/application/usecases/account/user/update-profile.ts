import { inject, injectable } from "tsyringe";
import { IUpdateUserProfileUseCase } from "application/interfaces/user/i-update-user-profile.usecase";
import { UserProfileUpdateRequestDTO } from "application/dto/user/update-user-profile.dto";
import { UserEntity } from "domain/entities/UserEntity";
import { I_USER_REPO_TOKEN, IUserRepo } from "domain/repositories/IUserRepo";
import { I_NOTIFICATION_REPO_TOKEN, INotificationRepo } from "domain/repositories/INotifctionRepo";
import { I_NOTIFICATION_SERVICE_TOKEN, INotificationService } from "domain/services/i-notification.service";
import { NotificationMapper } from "application/mappers/notification-mapper";
import { AppError } from "domain/errors/AppError";
import { HttpStatus } from "utils/HttpStatus";
import { ERROR_MESSAGES } from "utils/ErrorMessage";

@injectable()
export class UpdateUserProfileUseCase implements IUpdateUserProfileUseCase {
  constructor(
    @inject(I_USER_REPO_TOKEN)
    private readonly _userRepository: IUserRepo,

    @inject(I_NOTIFICATION_SERVICE_TOKEN)
    private readonly _notificationService: INotificationService,

    @inject(I_NOTIFICATION_REPO_TOKEN)
    private readonly _notificationRepository: INotificationRepo
  ) { }

  async execute(updateRequest: UserProfileUpdateRequestDTO): Promise<void> {
    const { userId, data } = updateRequest;

    const existingUser = await this._userRepository.findUserById(userId);
    if (!existingUser) {
      throw new AppError(ERROR_MESSAGES.USER_NOT_FOUND, HttpStatus.NOT_FOUND);
    }

    if (existingUser.isBlocked()) {
      throw new AppError(ERROR_MESSAGES.ACCOUNT_BLOCKED, HttpStatus.FORBIDDEN);
    }

    const updatedUserEntity = new UserEntity(
      data.name || existingUser.name,
      existingUser.email,
      userId,
      existingUser.role,
      existingUser.password,
      existingUser.status,
      existingUser.createdAt,
      data.gender ?? existingUser.gender,
      data.age ?? existingUser.age,
      existingUser.googleId,
      data.phone ?? existingUser.phone,
      data.address ?? existingUser.address,
      existingUser.profilePic
    );

    await this._userRepository.updateUserData(userId, updatedUserEntity);

    await this._dispatchUpdateNotification(userId);
  }


  private async _dispatchUpdateNotification(userId: string): Promise<void> {
    const notificationEntity = NotificationMapper.toCreateEntity({
      title: "Profile Updated",
      message: "Your profile information has been successfully updated.",
      recipientId: userId,
      senderId: "SYSTEM_SECURITY"
    });

    await this._notificationRepository.addNotification(notificationEntity);

    await this._notificationService.notifyUser(
      userId,
      NotificationMapper.toResponseDTO(notificationEntity)
    );
  }
}
import { inject, injectable } from "tsyringe";
import { IUpdateUserProfileUseCase } from "application/interfaces/user/i-update-user-profile.usecase";
import { UpdateUserProfileRequestDTO } from "application/dto/account/user/update-user-profile.dto";
import { IUserRepo, I_USER_REPO_TOKEN } from "domain/repositories/IUserRepo";
import { I_NOTIFICATION_REPO_TOKEN, INotificationRepo } from "domain/repositories/INotifctionRepo";
import { I_NOTIFICATION_SERVICE_TOKEN, INotificationService } from "domain/services/i-notification.service";
import { NotificationMapper } from "application/mappers/notification-mapper";
import { AppError } from "domain/errors/AppError";
import { HttpStatus } from "utils/HttpStatus";
import { ERROR_MESSAGES } from "utils/ErrorMessage";

@injectable()
export class UpdateUserProfileUseCase implements IUpdateUserProfileUseCase {
  constructor(
    @inject(I_USER_REPO_TOKEN) private readonly _userRepository: IUserRepo,
    @inject(I_NOTIFICATION_SERVICE_TOKEN) private readonly _notificationService: INotificationService,
    @inject(I_NOTIFICATION_REPO_TOKEN) private readonly _notificationRepository: INotificationRepo
  ) { }

  async execute(userId: string, profileData: UpdateUserProfileRequestDTO): Promise<void> {

    const existingUser = await this._userRepository.findUserById(userId);

    if (!existingUser) {
      throw new AppError(ERROR_MESSAGES.USER_NOT_FOUND, HttpStatus.NOT_FOUND);
    }

    if (existingUser.isBlocked()) {
      throw new AppError(ERROR_MESSAGES.ACCOUNT_BLOCKED, HttpStatus.FORBIDDEN);
    }

    const updatedUser =
      existingUser.update({
        name: profileData.name,
        phone: profileData.phone,
        address: profileData.address,
        gender: profileData.gender,
        age: profileData.age
      });

    await this._userRepository.updateUserData(userId, updatedUser);
    await this._sendProfileUpdateNotification(userId);
  }

  private async _sendProfileUpdateNotification(userId: string): Promise<void> {

    const notification = NotificationMapper.toCreateEntity({
      title: "Profile Updated",
      message: "Your profile information has been updated successfully.",
      recipientId: userId,
      senderId: "SYSTEM_SECURITY"
    });

    await this._notificationRepository.addNotification(notification);
    await this._notificationService.notifyUser(userId, NotificationMapper.toResponseDTO(notification)
    );
  }
}
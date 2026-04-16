import { injectable, inject } from "tsyringe";
import { IUpdateUserProfileUseCase } from "application/interfaces/user/i-update-user-profile.usecase";
import { I_USER_REPO_TOKEN, IUserRepo } from "domain/repositories/IUserRepo";
import { AppError } from "domain/errors/AppError";
import { HttpStatus } from "utils/HttpStatus";
import { UserProfileUpdateRequestDTO } from "application/dto/user/update-user-profile.dto";
import { UserEntity } from "domain/entities/UserEntity";
import { ERROR_MESSAGES } from "utils/ErrorMessage";
import { NotificationMapper } from "application/mappers/notification-mapper";
import { I_NOTIFICATION_SERVICE_TOKEN, INotificationService } from "domain/services/i-notification.service";
import { I_NOTIFICATION_REPO_TOKEN, INotificationRepo } from "domain/repositories/INotifctionRepo";

@injectable()
export class UpdateUserProfileUseCase implements IUpdateUserProfileUseCase {
  constructor(
    @inject(I_USER_REPO_TOKEN) private readonly _userRepo: IUserRepo,
    @inject(I_NOTIFICATION_SERVICE_TOKEN) private _notificationService: INotificationService,
    @inject(I_NOTIFICATION_REPO_TOKEN) private _notificationRepo: INotificationRepo
  ) { }

  async execute(input: UserProfileUpdateRequestDTO): Promise<void> {
    const { userId, data } = input;

    const existingUser = await this._userRepo.findUserById(userId);
    if (!existingUser) {
      throw new AppError(ERROR_MESSAGES.USER_NOT_FOUND, HttpStatus.NOT_FOUND);
    }

    const updatedEntity = new UserEntity(
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

    if (updatedEntity.isBlocked()) {
      throw new AppError(ERROR_MESSAGES.ACCOUNT_BLOCKED, HttpStatus.FORBIDDEN);
    }

    await this._userRepo.updateUserData(userId, updatedEntity);
    const notificationData = {
      title: "Profile Updated",
      message: "Your profile information has been successfully updated.",
      recipientId: userId,
      senderId: "SYSTEM_SECURITY"
    };

    const entity = NotificationMapper.toCreateEntity(notificationData);


    await this._notificationRepo.addNotification(entity);
    await this._notificationService.notifyUser(
      userId,
      NotificationMapper.toResponseDTO(entity)
    );
  }
}
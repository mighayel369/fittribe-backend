import { inject, injectable } from "tsyringe";
import { IUpdateProfilePicture } from "application/interfaces/common/i-update-profile-picture.usecase";
import { ProfilePictureFileDTO, UpdateProfilePictureResponseDTO, UpdateProfilePictureResponseSchema } from "application/dto/account/shared/update-avatar.dto";
import { IUserRepo, I_USER_REPO_TOKEN } from "domain/repositories/IUserRepo";
import { I_CLOUDINARY_SERVICE_TOKEN, ICloudinaryService } from "domain/services/ICloudinaryService";
import { AppError } from "domain/errors/AppError";
import { HttpStatus } from "utils/HttpStatus";
import { ERROR_MESSAGES } from "utils/ErrorMessage";

@injectable()
export class UpdateUserProfilePictureUseCase implements IUpdateProfilePicture {
  constructor(
    @inject(I_USER_REPO_TOKEN) private readonly _userRepository: IUserRepo,
    @inject(I_CLOUDINARY_SERVICE_TOKEN) private readonly _cloudinaryService: ICloudinaryService
  ) { }

  async execute(userId: string, file: ProfilePictureFileDTO): Promise<UpdateProfilePictureResponseDTO> {

    const user = await this._userRepository.findUserById(userId);
    if (!user) {
      throw new AppError(ERROR_MESSAGES.USER_NOT_FOUND, HttpStatus.NOT_FOUND);
    }

    const imageUrl = await this._cloudinaryService.getProfilePictureUrl(file, userId);

    await this._userRepository.updateUserProfilePicture(userId, imageUrl);
    return UpdateProfilePictureResponseSchema.parse({
      imageUrl
    });
  }
}
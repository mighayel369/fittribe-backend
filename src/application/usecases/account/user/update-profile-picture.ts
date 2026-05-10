import { inject, injectable } from "tsyringe";
import { IUpdateProfilePicture } from "application/interfaces/common/i-update-profile-picture.usecase";
import { UpdateProfilePictureRequestDTO } from "application/dto/common/update-profile-picture.dto.";
import { I_USER_REPO_TOKEN, IUserRepo } from "domain/repositories/IUserRepo";
import { I_CLOUDINARY_SERVICE_TOKEN, ICloudinaryService } from "domain/services/ICloudinaryService";
import { AppError } from "domain/errors/AppError";
import { HttpStatus } from "utils/HttpStatus";
import { ERROR_MESSAGES } from "utils/ErrorMessage";

@injectable()
export class UpdateUserProfilePicture implements IUpdateProfilePicture {
  constructor(
    @inject(I_USER_REPO_TOKEN)
    private readonly _userRepository: IUserRepo,

    @inject(I_CLOUDINARY_SERVICE_TOKEN)
    private readonly _cloudinaryService: ICloudinaryService
  ) { }

  async execute(updateRequest: UpdateProfilePictureRequestDTO): Promise<string> {
    const { id, profilePic } = updateRequest;

    if (!profilePic) {
      throw new AppError(ERROR_MESSAGES.PROFILE_PICTURE_MISSING, HttpStatus.BAD_REQUEST);
    }

    const userAccount = await this._userRepository.findUserById(id);
    if (!userAccount) {
      throw new AppError(ERROR_MESSAGES.USER_NOT_FOUND, HttpStatus.NOT_FOUND);
    }

    const uploadedImageUrl = await this._cloudinaryService.getProfilePictureUrl(profilePic, id);

    await this._userRepository.updateUserProfilePicture(id, uploadedImageUrl);

    return uploadedImageUrl;
  }
}
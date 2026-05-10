import { inject, injectable } from "tsyringe";
import { IUpdateProfilePicture } from "application/interfaces/common/i-update-profile-picture.usecase";
import { UpdateProfilePictureRequestDTO } from "application/dto/common/update-profile-picture.dto.";
import { ITrainerRepo, I_TRAINER_REPO_TOKEN } from "domain/repositories/ITrainerRepo";
import { I_CLOUDINARY_SERVICE_TOKEN, ICloudinaryService } from "domain/services/ICloudinaryService";
import { AppError } from "domain/errors/AppError";
import { HttpStatus } from "utils/HttpStatus";
import { ERROR_MESSAGES } from "utils/ErrorMessage";

@injectable()
export class UpdateTrainerProfilePicture implements IUpdateProfilePicture {
  constructor(
    @inject(I_TRAINER_REPO_TOKEN)
    private readonly _trainerRepository: ITrainerRepo,

    @inject(I_CLOUDINARY_SERVICE_TOKEN)
    private readonly _cloudinaryService: ICloudinaryService
  ) { }

  async execute(updateRequest: UpdateProfilePictureRequestDTO): Promise<string> {
    const { id, profilePic } = updateRequest;

    if (!profilePic) {
      throw new AppError(ERROR_MESSAGES.PROFILE_PICTURE_MISSING, HttpStatus.BAD_REQUEST);
    }

    const trainerAccount = await this._trainerRepository.findTrainerById(id);
    if (!trainerAccount) {
      throw new AppError(ERROR_MESSAGES.TRAINER_NOT_FOUND, HttpStatus.NOT_FOUND);
    }

    const uploadedImageUrl = await this._cloudinaryService.getProfilePictureUrl(profilePic, id);

    await this._trainerRepository.updateTrainerProfilePicture(id, uploadedImageUrl);

    return uploadedImageUrl;
  }
}
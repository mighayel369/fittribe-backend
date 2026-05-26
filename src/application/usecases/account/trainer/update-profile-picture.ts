import { inject, injectable } from "tsyringe";
import { IUpdateProfilePicture } from "application/interfaces/common/i-update-profile-picture.usecase";
import { ProfilePictureFileDTO, UpdateProfilePictureResponseDTO, UpdateProfilePictureResponseSchema } from "application/dto/account/shared/update-avatar.dto";
import { ITrainerRepo, I_TRAINER_REPO_TOKEN } from "domain/repositories/ITrainerRepo";
import { I_CLOUDINARY_SERVICE_TOKEN, ICloudinaryService } from "domain/services/ICloudinaryService";

import { AppError } from "domain/errors/AppError";
import { HttpStatus } from "utils/HttpStatus";
import { ERROR_MESSAGES } from "utils/ErrorMessage";

@injectable()
export class UpdateTrainerProfilePictureUseCase implements IUpdateProfilePicture {

  constructor(
    @inject(I_TRAINER_REPO_TOKEN) private readonly _trainerRepository: ITrainerRepo,
    @inject(I_CLOUDINARY_SERVICE_TOKEN) private readonly _cloudinaryService: ICloudinaryService
  ) { }

  async execute(trainerId: string, file: ProfilePictureFileDTO): Promise<UpdateProfilePictureResponseDTO> {
    const trainer = await this._trainerRepository.findTrainerById(trainerId);

    if (!trainer) {
      throw new AppError(ERROR_MESSAGES.TRAINER_NOT_FOUND, HttpStatus.NOT_FOUND);
    }

    const uploadedImageUrl = await this._cloudinaryService.getProfilePictureUrl(file, trainerId);
    await this._trainerRepository.updateTrainerProfilePicture(trainerId, uploadedImageUrl);
    return UpdateProfilePictureResponseSchema.parse({
      imageUrl: uploadedImageUrl
    });
  }
}
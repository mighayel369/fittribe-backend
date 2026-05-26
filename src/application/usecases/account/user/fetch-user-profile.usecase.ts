import { inject, injectable } from "tsyringe";
import { IFetchUserProfileUseCase } from "application/interfaces/user/i-fetch-user-details.usecase";
import { UserProfileResponseDTO } from "application/dto/account/user/user-details.dto";
import { IUserRepo, I_USER_REPO_TOKEN } from "domain/repositories/IUserRepo";
import { UserMapper } from "application/mappers/user-mapper";
import { AppError } from "domain/errors/AppError";
import { HttpStatus } from "utils/HttpStatus";
import { ERROR_MESSAGES } from "utils/ErrorMessage";

@injectable()
export class FetchUserProfileUseCase implements IFetchUserProfileUseCase<UserProfileResponseDTO >{
  constructor(
    @inject(I_USER_REPO_TOKEN) private readonly _userRepository: IUserRepo
  ) { }

  async execute(userId: string): Promise<UserProfileResponseDTO> {
    if (!userId) {
      throw new AppError(ERROR_MESSAGES.INVALID_CREDENTIALS, HttpStatus.BAD_REQUEST
      );
    }

    const user = await this._userRepository.findUserById(userId);
    if (!user) {
      throw new AppError(ERROR_MESSAGES.USER_NOT_FOUND, HttpStatus.NOT_FOUND
      );
    }

    return UserMapper.toProfileResponseDTO(user);
  }
}
import { inject, injectable } from "tsyringe";
import { IFetchUserDetailsUseCase } from "application/interfaces/user/i-fetch-user-details.usecase";
import { UserProfileDTO } from "application/dto/user/user-details.dto";
import { I_USER_REPO_TOKEN, IUserRepo } from "domain/repositories/IUserRepo";
import { UserMapper } from "application/mappers/user-mapper";
import { AppError } from "domain/errors/AppError";
import { HttpStatus } from "utils/HttpStatus";
import { ERROR_MESSAGES } from "utils/ErrorMessage";

@injectable()
export class FetchUserProfileUseCase implements IFetchUserDetailsUseCase<UserProfileDTO> {
  constructor(
    @inject(I_USER_REPO_TOKEN)
    private readonly _userRepository: IUserRepo
  ) { }

  async execute(userId: string): Promise<UserProfileDTO> {
    if (!userId) {
      throw new AppError(ERROR_MESSAGES.INVALID_CREDENTIALS, HttpStatus.BAD_REQUEST);
    }

    const userAccount = await this._userRepository.findUserById(userId);


    if (!userAccount) {
      throw new AppError(ERROR_MESSAGES.USER_NOT_FOUND, HttpStatus.NOT_FOUND);
    }

    return UserMapper.toUserProfileDTO(userAccount);
  }
}
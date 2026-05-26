import { inject, injectable } from "tsyringe";
import { I_USER_REPO_TOKEN, IUserRepo } from "domain/repositories/IUserRepo";
import { IFetchUserProfileUseCase } from "application/interfaces/user/i-fetch-user-details.usecase";
import { AppError } from "domain/errors/AppError";
import { ERROR_MESSAGES } from "utils/ErrorMessage";
import { UserMapper } from "application/mappers/user-mapper";
import { HttpStatus } from "utils/HttpStatus";
import { AdminUserDetailDTO, AdminUserDetailSchema } from "application/dto/management/user-management/user-profile.dto";

@injectable()
export class FetchUserDetailsForAdmin implements IFetchUserProfileUseCase<AdminUserDetailDTO> {

  constructor(
    @inject(I_USER_REPO_TOKEN)
    private readonly _userRepository: IUserRepo
  ) { }

  async execute(userId: string): Promise<AdminUserDetailDTO> {

    if (!userId) {
      throw new AppError(ERROR_MESSAGES.MISSING_REQUIRED_DATA, HttpStatus.BAD_REQUEST);
    }

    const user = await this._userRepository.findUserById(userId);

    if (!user) {
      throw new AppError(ERROR_MESSAGES.NOT_FOUND, HttpStatus.NOT_FOUND);
    }

    return AdminUserDetailSchema.parse(
      UserMapper.toAdminDetailDTO(user)
    );
  }
}
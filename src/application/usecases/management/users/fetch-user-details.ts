import { inject, injectable } from "tsyringe";
import { I_USER_REPO_TOKEN, IUserRepo } from "domain/repositories/IUserRepo";
import { IFetchUserDetailsUseCase } from "application/interfaces/user/i-fetch-user-details.usecase";
import { AdminUserDetailDTO } from "application/dto/user/user-details.dto";
import { AppError } from "domain/errors/AppError";
import { ERROR_MESSAGES } from "utils/ErrorMessage";
import { UserMapper } from "application/mappers/user-mapper";
import { HttpStatus } from "utils/HttpStatus";
@injectable()
export class FetchUserDetailsForAdmin implements IFetchUserDetailsUseCase<AdminUserDetailDTO> {
  constructor(
    @inject(I_USER_REPO_TOKEN)
    private readonly _userRepository: IUserRepo
  ) { }

  async execute(userId: string): Promise<AdminUserDetailDTO> {
    const user = await this._userRepository.findUserById(userId);

    if (!user) {
      throw new AppError(ERROR_MESSAGES.NOT_FOUND, HttpStatus.NOT_FOUND);
    }

    return UserMapper.toAdminDetailDTO(user);
  }
}

import { inject, injectable } from "tsyringe";
import { IVerifySession } from "application/interfaces/auth/i-verify-session.usecase";
import { I_USER_REPO_TOKEN, IUserRepo } from "domain/repositories/IUserRepo";
import { AuthMapper } from "application/mappers/auth-mapper";
import { AppError } from "domain/errors/AppError";
import { HttpStatus } from "utils/HttpStatus";
import { ERROR_MESSAGES } from "utils/ErrorMessage";
import { ClientSessionResponseDTO } from "application/dto/account/user/verify-session.dto";

@injectable()
export class VerifyClientSessionUseCase implements IVerifySession<ClientSessionResponseDTO> {
  constructor(
    @inject(I_USER_REPO_TOKEN) private readonly _userRepository: IUserRepo
  ) { }

  async execute(userId: string): Promise<ClientSessionResponseDTO> {

    const userAccount = await this._userRepository.findUserById(userId);

    if (!userAccount) {
      throw new AppError(ERROR_MESSAGES.USER_NOT_FOUND, HttpStatus.NOT_FOUND);
    }

    if (userAccount.isBlocked()) {
      throw new AppError(ERROR_MESSAGES.USER_BLOCKED, HttpStatus.FORBIDDEN);
    }

    return AuthMapper.toClientSessionResponseDTO(userAccount);
  }
}
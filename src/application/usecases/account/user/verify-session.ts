import { inject, injectable } from "tsyringe";
import { ClientSessionDTO } from "application/dto/auth/verify-session.dto";
import { IVerifySession } from "application/interfaces/auth/i-verify-session.usecase";
import { I_USER_REPO_TOKEN, IUserRepo } from "domain/repositories/IUserRepo";
import { AuthMapper } from "application/mappers/auth-mapper";
import { AppError } from "domain/errors/AppError";
import { HttpStatus } from "utils/HttpStatus";
import { ERROR_MESSAGES } from "utils/ErrorMessage";

@injectable()
export class VerifyClientSession implements IVerifySession<ClientSessionDTO> {
  constructor(
    @inject(I_USER_REPO_TOKEN)
    private readonly _userRepository: IUserRepo
  ) { }

  async execute(userId: string): Promise<ClientSessionDTO> {
    const userAccount = await this._userRepository.findUserById(userId);

    if (!userAccount) {
      throw new AppError(ERROR_MESSAGES.USER_NOT_FOUND, HttpStatus.NOT_FOUND);
    }

    if (userAccount.isBlocked()) {
      throw new AppError(ERROR_MESSAGES.USER_BLOCKED, HttpStatus.FORBIDDEN);
    }

    return AuthMapper.toVerifySessionResponseDTO(userAccount);
  }
}

import { IUpdateStatus } from "application/interfaces/common/i-update-status.usecase";
import { inject, injectable } from "tsyringe";
import { I_USER_REPO_TOKEN, IUserRepo } from "domain/repositories/IUserRepo";
import { AppError } from "domain/errors/AppError";
import { HttpStatus } from "utils/HttpStatus";
import logger from "utils/logger";
import { UpdateStatusRequestDTO } from "application/dto/common/update-status.dto";
import { ERROR_MESSAGES } from "utils/ErrorMessage";
@injectable()
export class UpdateUserStatusUseCase implements IUpdateStatus {
  constructor(
    @inject(I_USER_REPO_TOKEN)
    private readonly _userRepository: IUserRepo
  ) { }

  async execute(statusData: UpdateStatusRequestDTO): Promise<void> {
    const { id, isActive } = statusData;

    const user = await this._userRepository.findUserById(id);
    if (!user) {
      throw new AppError(ERROR_MESSAGES.NOT_FOUND, HttpStatus.NOT_FOUND);
    }

    logger.info(`Admin Management: Updating User ${id} | Active Status: ${isActive}`);

    await this._userRepository.updateUserStatus(id, isActive);
  }
}
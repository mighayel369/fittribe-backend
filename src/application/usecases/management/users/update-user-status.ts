
import { IUpdateStatus } from "application/interfaces/common/i-update-status.usecase";
import { inject, injectable } from "tsyringe";
import { I_USER_REPO_TOKEN, IUserRepo } from "domain/repositories/IUserRepo";
import { AppError } from "domain/errors/AppError";
import { HttpStatus } from "utils/HttpStatus";
import logger from "../../../../logger/index";
import { ERROR_MESSAGES } from "utils/ErrorMessage";
import { UpdateUserStatusRequestDTO } from "application/dto/management/user-management/update-user-status.dto";

@injectable()
export class UpdateUserStatusUseCase implements IUpdateStatus<UpdateUserStatusRequestDTO> {
  private logger = logger;
  constructor(
    @inject(I_USER_REPO_TOKEN)
    private readonly _userRepository: IUserRepo
  ) { }

  async execute(statusData: UpdateUserStatusRequestDTO): Promise<void> {
    const { userId, isActive } = statusData;

    const user = await this._userRepository.findUserById(userId);
    if (!user) {
      throw new AppError(ERROR_MESSAGES.NOT_FOUND, HttpStatus.NOT_FOUND);
    }

    this.logger.info(`Admin Management: Updating User ${userId} | Active Status: ${isActive}`);

    await this._userRepository.updateUserStatus(userId, isActive);
  }
}